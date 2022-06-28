import {
  MutationResolvers,
  QueryResolvers,
  RoleCode,
  SubscriptionResolvers,
} from '@src/generated/graphql-endpoint.types';
import { EntityManager, UserInsert } from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { getEntityRoleCodes } from '@src/utils';
import AsyncLock from 'async-lock';

async function getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
  return getEntityRoleCodes(unsecureEntityManager.userRole, 'userId', requesterUserId);
}

const updateUserLock = new AsyncLock();

export default {
  Mutation: {
    newUserLoginIdentity: async (parent, args, context: ApolloResolversContext, info) => {
      // TODO NOW: Finish user login identity crud graphql endpiont
    },
  },

  Subscription: {
    userLoginIdentityCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserLoginIdentityCreated)
      .shallowOneToOneFilter()
      .mapId()
      .build(),

    userLoginIdentityUpdated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserLoginIdentityUpdated)
      .shallowOneToOneFilter()
      .mapId()
      .build(),

    userLoginIdentityDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserLoginIdentityDeleted)
      .shallowOneToOneFilter()
      .mapId()
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function makeUser(entityManager: EntityManager, record: UserInsert, emitSubscription: boolean = true) {
  const user = await entityManager.user.insertOne({
    record,
  });

  await entityManager.userRole.insertOne({
    record: {
      roleCode: RoleCode.User,
      userId: user.id,
    },
  });

  if (emitSubscription) {
    pubsub.publish(PubSubEvents.UserCreated, user);
  }
  return user;
}
