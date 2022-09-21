import {
  InviteType,
  MutationResolvers,
  Permission,
  QueryResolvers,
  RoleCode,
  SubscriptionResolvers,
} from '@src/generated/graphql-endpoint.types';
import { Access, SubscriptionProjectInviteCreatedArgs } from '@src/generated/model.types';
import { EntityManager, ProjectDAO, ProjectInviteFilter, ProjectMemberInsert } from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { daoInsertRolesBatch, FuncQueue, startEntityManagerTransaction } from '@src/utils';

const acceptProjectInvite: MutationResolvers['acceptProjectInvite'] = async (
  parent,
  args,
  context: ApolloResolversContext,
  info,
) => {
  const invite = await context.unsecureEntityManager.projectInvite.findOne({
    filter: { id: args.inviteId },
  });

  if (!invite) throw new HttpError(400, "Invite doesn't exist!");

  if (invite.type === InviteType.Incoming) {
    makePermsCalc()
      .withContext(context.securityContext)
      .withDomain({ projectId: invite.projectId })
      .assertPermission(Permission.UpdateProject);
  } else if (invite.type === InviteType.Outgoing) {
    makePermsCalc()
      .withContext(context.securityContext)
      .withDomain({ projectInviteId: args.inviteId })
      .assertPermission(Permission.ManageProjectInvites);
  }

  const error = await startEntityManagerTransaction(
    context.unsecureEntityManager,
    context.mongoClient,
    async (transEntityManager, postTransFuncQueue) => {
      await makeProjectMember({
        entityManager: transEntityManager,
        record: {
          userId: invite.userId,
          projectId: invite.projectId,
        },
        subFuncQueue: postTransFuncQueue,
      });
      await deleteProjectInvites({
        entityManager: transEntityManager,
        record: {
          id: args.inviteId,
        },
      });
      // TODO NOW: Finish converting all deleteProjectInvites into a func that takes in one options param.
      // TODO NEXT: Refactor all other creation/update/destruction to use postTransFuncQueue to defer pubsub calls
    },
  );

  if (error) throw error;

  return true;
};

// Add verification for subscriptions because invites are private information
async function verifySub(
  parent: any,
  args: SubscriptionProjectInviteCreatedArgs,
  context: ApolloResolversContext,
  info: any,
) {
  const permCalc = makePermsCalc().withContext(context.securityContext);
  if (!args.filter || Object.keys(args.filter).length == 0) {
    permCalc.assertPermission(Permission.ManageProjectInvites);
    return;
  }

  if ((args.filter.userId && args.filter.projectId) || args.filter.userId) {
    permCalc
      .withDomain({
        userId: args.filter.userId,
      })
      .assertPermission(Permission.UpdateUser);
    return;
  }

  if (args.filter.projectId) {
    permCalc
      .withDomain({
        projectId: args.filter.projectId,
      })
      .assertPermission(Permission.UpdateProject);
  }
}

export default {
  Mutation: {
    // Requesting user to accept
    newProjectInvite: async (parent, args, context: ApolloResolversContext, info) => {
      // Check permissions
      if (args.input.type === InviteType.Outgoing)
        if (
          !makePermsCalc()
            .withContext(context.securityContext)
            .withDomain({
              projectId: args.input.projectId,
            })
            .hasPermission(Permission.UpdateProject)
        ) {
          throw new HttpError(401, 'Not authorized!');
        }

      const userExists = await context.unsecureEntityManager.user.exists({
        filter: { id: args.input.userId },
      });
      if (!userExists) throw new HttpError(400, "User doesn't exist!");

      const project = await context.unsecureEntityManager.project.findOne({
        filter: { id: args.input.projectId },
        projection: ProjectDAO.projection({
          access: true,
        }),
      });
      if (!project) throw new HttpError(400, "Project doesn't exist!");
      if (args.input.type === InviteType.Incoming)
        if (project.access !== Access.Invite)
          throw new HttpError(403, "Cannot request invite for project whose access isn't 'INVITE'!");

      const inviteExists = await context.unsecureEntityManager.projectInvite.exists({
        filter: {
          type: args.input.type,
          projectId: args.input.projectId,
          userId: args.input.userId,
        },
      });
      if (inviteExists) throw new HttpError(400, 'Invite already exists!');

      const oppositeInviteType = args.input.type === InviteType.Incoming ? InviteType.Outgoing : InviteType.Incoming;
      const oppositeInvite = await context.unsecureEntityManager.projectInvite.findOne({
        filter: {
          type: oppositeInviteType,
          projectId: args.input.projectId,
          userId: args.input.userId,
        },
        projection: {
          id: true,
        },
      });
      if (oppositeInvite) {
        await acceptProjectInvite(
          parent,
          {
            inviteId: oppositeInvite.id,
          },
          context,
          info,
        );
        return;
      } else {
        const insertedInvite = await context.unsecureEntityManager.projectInvite.insertOne({
          record: {
            type: args.input.type,
            projectId: args.input.projectId,
            userId: args.input.userId,
          },
        });

        pubsub.publish(PubSubEvents.ProjectInviteCreated, insertedInvite);
        return insertedInvite.id;
      }
    },

    acceptProjectInvite,

    deleteProjectInvite: async (parent, args, context: ApolloResolversContext, info) => {
      const invite = await context.unsecureEntityManager.projectInvite.findOne({
        filter: { id: args.inviteId },
      });

      if (!invite) throw new HttpError(400, "Invite doesn't exist!");

      const calc = makePermsCalc().withContext(context.securityContext);

      if (
        !calc.withDomain({ projectId: invite.projectId }).hasPermission(Permission.UpdateProject) &&
        !calc
          .withContext(context.securityContext)
          .withDomain({ projectInviteId: invite.id })
          .hasPermission(Permission.ManageProjectInvites)
      ) {
        throw new HttpError(403, 'Unauthorized');
      }
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteProjectInvites(transEntityManager, {
            id: args.inviteId,
          });
        },
      );

      if (error) throw error;

      return true;
    },

    joinOpenProject: async (parent, args, context: ApolloResolversContext, info) => {
      const userId = context.securityContext.userId;
      if (!userId) throw new HttpError(400, 'Expected context.securityContext.userId!');

      const project = await context.unsecureEntityManager.project.findOne({
        filter: { id: args.projectId },
        projection: ProjectDAO.projection({
          access: true,
        }),
      });
      if (!project) throw new HttpError(400, "Project doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          projectId: args.projectId,
        })
        .assertPermission(Permission.JoinProject);

      if (project.access !== Access.Open) throw new HttpError(403, "Project access is not 'OPEN'!");

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          await makeProjectMember({
            entityManager: transEntityManager,
            record: {
              userId,
              projectId: args.projectId,
            },
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error) throw error;

      return true;
    },
  },

  Subscription: {
    projectInviteCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectInviteCreated)
      .shallowOneToOneFilter()
      .secure(verifySub)
      .build(),

    projectInviteDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectInviteDeleted)
      .shallowOneToOneFilter()
      .secure(verifySub)
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function deleteProjectInvites(options: {
  entityManager: EntityManager;
  filter: ProjectInviteFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  let invites;
  if (options.emitSubscription) {
    invites = await options.entityManager.projectInvite.findAll({
      filter: options.filter,
    });
  }

  await options.entityManager.projectInvite.deleteAll({
    filter: options.filter,
  });

  if (invites && options.emitSubscription) {
    for (const invite of invites)
      pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectInviteDeleted, invite, options.subFuncQueue);
  }
}

export async function makeProjectMember(options: {
  entityManager: EntityManager;
  record: ProjectMemberInsert;
  additionalRoles?: RoleCode[];
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  if (!options.additionalRoles) options.additionalRoles = [];

  const member = await options.entityManager.projectMember.insertOne({
    record: options.record,
  });

  await daoInsertRolesBatch({
    dao: options.entityManager.projectMemberRole,
    roleCodes: [RoleCode.ProjectMember, ...options.additionalRoles],
    idKey: 'projectMemberId',
    id: member.id,
  });

  if (options.emitSubscription)
    pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectMemberCreated, member, options.subFuncQueue);

  return member;
}
