import { MutationResolvers, QueryResolvers, SubscriptionResolvers } from '@src/generated/graphql-endpoint.types';
import { Permission } from '@src/generated/model.types';
import {
  EntityManager,
  UserLoginIdentityFilter,
  UserLoginIdentityInsert,
  UserLoginIdentityUpdate,
} from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { FuncQueue, isDefined, startEntityManagerTransactionGraphQL } from '@src/utils';

export default {
  Mutation: {
    newUserLoginIdentity: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: args.input.userId,
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

      let loginIdentityId = '';
      const error = startEntityManagerTransactionGraphQL(context, async (transEntityManager, postTransFuncQueue) => {
        const loginIdentity = await makeUserLoginIdentity({
          entityManager: transEntityManager,
          record: args.input,
          subFuncQueue: postTransFuncQueue,
        });
        loginIdentityId = loginIdentity.id;
      });
      if (error instanceof Error) throw new HttpError(400, error.message);
      return loginIdentityId;
    },

    updateUserLoginIdentity: async (parent, args, context: ApolloResolversContext, info) => {
      const loginIdentity = await context.unsecureEntityManager.userLoginIdentity.findOne({
        filter: { id: args.input.id },
      });
      if (!loginIdentity) throw new HttpError(400, "Login identity doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: loginIdentity.userId,
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

      const error = startEntityManagerTransactionGraphQL(context, async (transEntityManager, postTransFuncQueue) => {
        await updateUserLoginIdentity({
          entityManager: transEntityManager,
          filter: { id: args.input.id },
          changes: {
            ...(isDefined(args.input.name) && { name: args.input.name }),
            ...(isDefined(args.input.data) && { data: args.input.data }),
            ...(isDefined(args.input.identityId) && { identityId: args.input.identityId }),
          },
          subFuncQueue: postTransFuncQueue,
        });
      });
      if (error instanceof Error) throw new HttpError(400, error.message);
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
          userId: loginIdentity.userId,
        })
        .assertPermission(Permission.UpdateUserPrivate);

      const error = startEntityManagerTransactionGraphQL(context, async (transEntityManager, postTransFuncQueue) => {
        await deleteUserLoginIdentity({
          entityManager: transEntityManager,
          filter: { id: args.id },
          subFuncQueue: postTransFuncQueue,
        });
      });
      if (error instanceof Error) throw new HttpError(400, error.message);
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

export async function makeUserLoginIdentity(options: {
  entityManager: EntityManager;
  record: UserLoginIdentityInsert;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, record, emitSubscription = true, subFuncQueue } = options;
  const loginIdentity = await entityManager.userLoginIdentity.insertOne({ record });
  if (emitSubscription)
    pubsub.publishOrAddToFuncQueue(PubSubEvents.UserLoginIdentityCreated, loginIdentity, subFuncQueue);
  return loginIdentity;
}

export async function updateUserLoginIdentity(options: {
  entityManager: EntityManager;
  filter: UserLoginIdentityFilter;
  changes: UserLoginIdentityUpdate;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, changes, emitSubscription = true, subFuncQueue } = options;
  await entityManager.userLoginIdentity.updateOne({ filter, changes });
  const updatedLoginIdentity = await entityManager.userLoginIdentity.findOne({ filter });
  if (!updatedLoginIdentity) throw new HttpError(400, 'Expected UserLoginIdentity to not be null during update!');
  if (emitSubscription)
    pubsub.publishOrAddToFuncQueue(PubSubEvents.UserLoginIdentityUpdated, updatedLoginIdentity, subFuncQueue);
  return updatedLoginIdentity;
}

export async function updateAllUserLoginIdentity(options: {
  entityManager: EntityManager;
  filter: UserLoginIdentityFilter;
  changes: UserLoginIdentityUpdate;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, changes, emitSubscription = true, subFuncQueue } = options;
  await entityManager.userLoginIdentity.updateAll({ filter, changes });
  const updatedLoginIdentities = await entityManager.userLoginIdentity.findAll({ filter });
  if (updatedLoginIdentities.length == 0)
    throw new HttpError(400, 'Expected UserLoginIdentity to not be null during updateAll!');
  if (emitSubscription)
    for (const identity in updatedLoginIdentities)
      pubsub.publishOrAddToFuncQueue(PubSubEvents.UserLoginIdentityUpdated, identity, subFuncQueue);
  return updatedLoginIdentities;
}

export async function deleteUserLoginIdentity(options: {
  entityManager: EntityManager;
  filter: UserLoginIdentityFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const identity = entityManager.userLoginIdentity.findOne({ filter });
  if (!identity) throw new HttpError(400, 'Expected UserLoginIdentity to not be null during delete!');
  await entityManager.userLoginIdentity.deleteOne({ filter });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.UserLoginIdentityDeleted, identity, subFuncQueue);
}

export async function deleteAllUserLoginIdentity(options: {
  entityManager: EntityManager;
  filter: UserLoginIdentityFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const loginIdentities = await entityManager.userLoginIdentity.findAll({ filter });
  await entityManager.userLoginIdentity.deleteAll({ filter });
  if (emitSubscription)
    for (const identity in loginIdentities)
      pubsub.publishOrAddToFuncQueue(PubSubEvents.UserLoginIdentityDeleted, identity, subFuncQueue);
}
