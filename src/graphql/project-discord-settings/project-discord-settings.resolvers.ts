import { MutationResolvers, QueryResolvers, SubscriptionResolvers } from '@src/generated/graphql-endpoint.types';
import { Permission } from '@src/generated/model.types';
import pubsub, { PubSubEvents } from '@src/graphql/pubsub';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { makeSubscriptionResolver } from '../subscription-resolver-builder';

export default {
  Mutation: {
    requestProjectDiscord: async (parent, args, context: ApolloResolversContext, info) => {
      const userId = context.securityContext.userId;
      if (!userId) throw new HttpError(400, 'Expected context.securityContext.userId!');

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          projectId: [args.projectId],
        })
        .assertPermission(Permission.UpdateProject);

      const project = await context.unsecureEntityManager.project.findOne({
        filter: { id: args.projectId },
      });
      if (!project) throw new HttpError(400, "Project doesn't exist!");

      pubsub.publish(PubSubEvents.ProjectDiscordRequested, project);

      return true;
    },
  },

  Subscription: {
    projectDiscordRequested: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectDiscordRequested)
      .shallowOneToOneFilter()
      .mapId()
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};
