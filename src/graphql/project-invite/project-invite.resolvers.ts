import { clearSecurityContext } from '@src/controllers/security.controller';
import {
  InviteType,
  MutationResolvers,
  Permission,
  QueryResolvers,
  SubscriptionResolvers,
} from '@src/generated/graphql-endpoint.types';
import { Access, SubscriptionProjectInviteCreatedArgs } from '@src/generated/model.types';
import { EntityManager, ProjectDAO, ProjectInviteFilter, ProjectInviteInsert } from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { FuncQueue, startEntityManagerTransactionGraphQL } from '@src/utils';
import { makeProjectMember } from '../project-member/project-member.resolvers';
import { clearProjectSecurityContexts } from '../project/project.resolvers';

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

  const error = await startEntityManagerTransactionGraphQL(context, async (transEntityManager, postTransFuncQueue) => {
    await makeProjectMember({
      entityManager: transEntityManager,
      record: {
        userId: invite.userId,
        projectId: invite.projectId,
      },
      subFuncQueue: postTransFuncQueue,
    });
    await deleteAllProjectInvites({
      entityManager: transEntityManager,
      filter: {
        id: args.inviteId,
      },
      subFuncQueue: postTransFuncQueue,
    });
  });

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
        )
          throw new HttpError(401, 'Not authorized!');

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
        let insertedInviteId = '';
        const error = startEntityManagerTransactionGraphQL(context, async (transEntityManager, postTransFuncQueue) => {
          const insertedInvite = await makeProjectInvite({
            entityManager: transEntityManager,
            record: {
              type: args.input.type,
              projectId: args.input.projectId,
              userId: args.input.userId,
            },
            subFuncQueue: postTransFuncQueue,
          });
          insertedInviteId = insertedInvite.id;
        });
        if (error instanceof Error) throw new HttpError(400, error.message);
        return insertedInviteId;
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
      const error = await startEntityManagerTransactionGraphQL(
        context,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteAllProjectInvites({
            entityManager: transEntityManager,
            filter: {
              id: args.inviteId,
            },
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);

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

      const error = await startEntityManagerTransactionGraphQL(
        context,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteAllProjectInvites({
            entityManager: transEntityManager,
            filter: {
              projectId: args.projectId,
              userId: userId,
            },
          });

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
      if (error instanceof Error) throw new HttpError(400, error.message);

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

export async function makeProjectInvite(options: {
  entityManager: EntityManager;
  record: ProjectInviteInsert;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, record, emitSubscription = true, subFuncQueue } = options;
  const projectInvite = await entityManager.projectInvite.insertOne({
    record,
  });
  // Update invite and project member security contexts
  subFuncQueue?.addFunc(async () => {
    await clearProjectSecurityContexts({ entityManager, filter: { id: record.projectId } });
    clearSecurityContext(entityManager, record.userId);
  });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectInviteCreated, projectInvite, subFuncQueue);
  return projectInvite;
}

export async function deleteProjectInvite(options: {
  entityManager: EntityManager;
  filter: ProjectInviteFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const invite = await entityManager.projectInvite.findOne({ filter });
  if (!invite) throw new HttpError(400, 'Expected ProjectInvite to not be null during delete!');
  await entityManager.projectInvite.deleteOne({ filter });
  // Update invite and project member security contexts
  subFuncQueue?.addFunc(async () => {
    await clearProjectSecurityContexts({ entityManager, filter: { id: invite.projectId } });
    clearSecurityContext(entityManager, invite.userId);
  });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectInviteDeleted, invite, subFuncQueue);
}

export async function deleteAllProjectInvites(options: {
  entityManager: EntityManager;
  filter: ProjectInviteFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const invites = await entityManager.projectInvite.findAll({ filter });
  await entityManager.projectInvite.deleteAll({ filter });
  // Update invite and project member security contexts
  subFuncQueue?.addFunc(async () => {
    for (const invite of invites) {
      await clearProjectSecurityContexts({ entityManager, filter: { id: invite.projectId } });
      clearSecurityContext(entityManager, invite.userId);
    }
  });
  if (emitSubscription) {
    for (const invite of invites)
      pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectInviteDeleted, invite, subFuncQueue);
  }
}
