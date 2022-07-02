import { MutationResolvers, QueryResolvers, SubscriptionResolvers } from '@src/generated/graphql-endpoint.types';
import { Permission } from '@src/generated/model.types';
import { EntityManager, UserLoginIdentityInsert } from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { isDefined } from '@src/utils';

export default {
  Mutation: {
    newUserLoginIdentity: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [args.input.userId],
        })
        .assertPermission(Permission.UpdateUserPrivate);

      const userExists = context.unsecureEntityManager.user.exists({
        filter: { id: args.input.userId },
      });
      if (!userExists) throw new HttpError(400, `User doesn't exist!`);

      const loginIdentityExists = await context.unsecureEntityManager.userLoginIdentity.exists({
        filter: {
          userId: args.input.userId,
          name: args.input.name,
        },
      });
      if (loginIdentityExists)
        throw new HttpError(400, `User already has a login identity of name "${args.input.name}"!`);

      const loginIdentity = await makeUserLoginIdentity(context.unsecureEntityManager, args.input);
      return loginIdentity.id;
    },

    updateUserLoginIdentity: async (parent, args, context: ApolloResolversContext, info) => {
      const loginIdentity = await context.unsecureEntityManager.userLoginIdentity.findOne({
        filter: { id: args.input.id },
      });
      if (!loginIdentity) throw new HttpError(400, "Login identity doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [loginIdentity.userId],
        })
        .assertPermission(Permission.UpdateUserPrivate);

      if (args.input.name) {
        const identityWithSameNameExists = await context.unsecureEntityManager.userLoginIdentity.exists({
          filter: {
            userId: loginIdentity.userId,
            name: args.input.name,
          },
        });
        if (identityWithSameNameExists) throw new HttpError(400, `Identity with same name exists for the same user!`);
      }

      await context.unsecureEntityManager.userLoginIdentity.updateOne({
        filter: { id: args.input.id },
        changes: {
          ...(isDefined(args.input.name) && { name: args.input.name }),
          ...(isDefined(args.input.data) && { data: args.input.data }),
          ...(isDefined(args.input.identityId) && { identityId: args.input.identityId }),
        },
      });

      const updatedLoginIdentity = await context.unsecureEntityManager.userLoginIdentity.findOne({
        filter: { id: args.input.id },
      });

      pubsub.publish(PubSubEvents.UserLoginIdentityUpdated, updatedLoginIdentity);
      return true;
    },

    deleteUserLoginIdentity: async (parent, args, context: ApolloResolversContext, info) => {
      const loginIdentity = await context.unsecureEntityManager.userLoginIdentity.findOne({
        filter: { id: args.id },
      });
      if (!loginIdentity) throw new HttpError(400, "Login identity doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [loginIdentity.userId],
        })
        .assertPermission(Permission.UpdateUserPrivate);

      await context.unsecureEntityManager.userLoginIdentity.deleteOne({
        filter: { id: args.id },
      });

      pubsub.publish(PubSubEvents.UserLoginIdentityDeleted, loginIdentity);
      return true;
    },
  },

  Subscription: {
    userLoginIdentityCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserLoginIdentityCreated)
      .shallowOneToOneFilter()
      .build(),

    userLoginIdentityUpdated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserLoginIdentityUpdated)
      .shallowOneToOneFilter()
      .build(),

    userLoginIdentityDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserLoginIdentityDeleted)
      .shallowOneToOneFilter()
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function makeUserLoginIdentity(
  entityManager: EntityManager,
  record: UserLoginIdentityInsert,
  emitSubscription: boolean = true,
) {
  const loginIdentity = await entityManager.userLoginIdentity.insertOne({
    record,
  });

  if (emitSubscription) pubsub.publish(PubSubEvents.UserLoginIdentityCreated, loginIdentity);
  return loginIdentity;
}
