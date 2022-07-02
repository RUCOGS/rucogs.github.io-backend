import {
  InviteType,
  MutationResolvers,
  Permission,
  QueryResolvers,
  RoleCode,
  SubscriptionResolvers,
} from '@src/generated/graphql-endpoint.types';
import { Access } from '@src/generated/model.types';
import { EntityManager, ProjectDAO, ProjectInviteFilter, ProjectMemberInsert } from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { daoInsertRolesBatch, startEntityManagerTransaction } from '@src/utils';

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
      .withDomain({ projectId: [invite.projectId] })
      .assertPermission(Permission.UpdateProject);
  } else if (invite.type === InviteType.Outgoing) {
    makePermsCalc()
      .withContext(context.securityContext)
      .withDomain({ projectInviteId: [args.inviteId] })
      .assertPermission(Permission.ManageProjectInvites);
  }
  const error = await startEntityManagerTransaction(
    context.unsecureEntityManager,
    context.mongoClient,
    async (transEntitymanager) => {
      await makeProjectMember(transEntitymanager, {
        userId: invite.userId,
        projectId: invite.projectId,
      });
      await transEntitymanager.projectInvite.deleteOne({
        filter: { id: args.inviteId },
      });
    },
  );

  if (error) throw error;

  pubsub.publish(PubSubEvents.ProjectInviteDeleted, invite);
  return true;
};

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
              projectId: [args.input.projectId],
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
        !calc.withDomain({ projectId: [invite.projectId] }).hasPermission(Permission.UpdateProject) &&
        !calc
          .withContext(context.securityContext)
          .withDomain({ projectInviteId: [invite.id] })
          .hasPermission(Permission.ManageProjectInvites)
      ) {
        throw new HttpError(403, 'Unauthorized');
      }
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntitymanager) => {
          await deleteProjectInvites(transEntitymanager, {
            id: args.inviteId,
          });
        },
      );

      if (error) throw error;

      pubsub.publish(PubSubEvents.ProjectInviteDeleted, invite);
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

      if (project.access !== Access.Open) throw new HttpError(403, "Project access is not 'OPEN'!");

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          await makeProjectMember(transEntityManager, {
            userId,
            projectId: args.projectId,
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
      .build(),

    projectInviteDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectInviteDeleted)
      .shallowOneToOneFilter()
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function deleteProjectInvites(
  entityManager: EntityManager,
  filter: ProjectInviteFilter,
  emitSubscription: boolean = true,
) {
  let invites;
  if (emitSubscription) {
    invites = await entityManager.projectInvite.findAll({
      filter,
    });
  }

  await entityManager.projectInvite.deleteAll({
    filter,
  });

  if (invites && emitSubscription) {
    for (const invite of invites) pubsub.publish(PubSubEvents.ProjectInviteDeleted, invite);
  }
}

export async function makeProjectMember(
  entityManager: EntityManager,
  record: ProjectMemberInsert,
  additionalRoles: RoleCode[] = [],
  emitSubscription: boolean = true,
) {
  const member = await entityManager.projectMember.insertOne({
    record,
  });
  await daoInsertRolesBatch({
    dao: entityManager.projectMemberRole,
    roleCodes: [RoleCode.ProjectMember, ...additionalRoles],
    idKey: 'projectMemberId',
    id: member.id,
  });

  if (emitSubscription) pubsub.publish(PubSubEvents.ProjectMemberCreated, member);
  return member;
}
