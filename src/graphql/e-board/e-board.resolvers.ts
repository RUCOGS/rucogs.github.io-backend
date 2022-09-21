import { DataSize, fileUploadPromiseToCdn, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';
import {
  MutationResolvers,
  QueryResolvers,
  SubscriptionResolvers,
  UploadOperation,
} from '@src/generated/graphql-endpoint.types';
import { Permission, RoleCode } from '@src/generated/model.types';
import {
  EBoardFilter,
  EBoardInsert,
  EBoardTermFilter,
  EBoardTermInsert,
  EBoardTermUpdate,
  EBoardUpdate,
  EntityManager,
  UserDAO,
} from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc, RoleType } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import {
  assertRequesterCanManageRoleCodes,
  assertRolesAreOfType,
  daoInsertRolesBatch,
  FuncQueue,
  isDefined,
  startEntityManagerTransaction,
  startEntityManagerTransactionGraphQL,
} from '@src/utils';
import AsyncLock from 'async-lock';

async function getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
  const requesterUser = await unsecureEntityManager.user.findOne({
    filter: {
      id: requesterUserId,
    },
    projection: UserDAO.projection({
      roles: {
        roleCode: true,
      },
    }),
  });
  if (!requesterUser) throw new Error('Expected user to exist!');
  let requesterRoles: RoleCode[] = requesterUser.roles.map((x) => x.roleCode);

  return requesterRoles;
}

const updateEBoardLock = new AsyncLock();

export default {
  Mutation: {
    newEBoard: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: args.input.userId,
        })
        .assertPermission(Permission.ManageEboard);

      const exists = await context.unsecureEntityManager.eBoard.exists({
        filter: { userId: args.input.userId },
      });
      if (exists) throw new HttpError(400, 'EBoard already exists for this user!');

      let eBoardId = '';
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          const eBoard = await makeEBoard({
            entityManager: transEntityManager,
            record: args.input,
            subFuncQueue: postTransFuncQueue,
          });
          eBoardId = eBoard.id;
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);
      return eBoardId;
    },

    updateEBoard: async (parent, args, context: ApolloResolversContext, info) => {
      await updateEBoardLock.acquire('lock', async () => {
        const eBoard = await context.unsecureEntityManager.eBoard.findOne({
          filter: { id: args.input.id },
          projection: {
            userId: true,
            avatarLink: true,
          },
        });
        if (!eBoard) throw new HttpError(400, "EBoard doesn't exist!");

        const permCalc = makePermsCalc().withContext(context.securityContext).withDomain({
          userId: eBoard.userId,
        });

        permCalc.assertPermission(Permission.ManageEboard);

        const error = await startEntityManagerTransaction(
          context.unsecureEntityManager,
          context.mongoClient,
          async (transEntityManager, postTransFuncQueue) => {
            if (!context.securityContext.userId) throw new HttpError(400, 'Expected context.securityContext.userId!');

            let avatarSelfHostedFilePath = null;
            if (isDefined(args.input.avatar)) {
              if (
                args.input.avatar.operation === UploadOperation.Insert ||
                args.input.avatar.operation === UploadOperation.Delete
              )
                tryDeleteFileIfSelfHosted(eBoard.avatarLink);

              if (args.input.avatar.operation === UploadOperation.Insert) {
                avatarSelfHostedFilePath = await fileUploadPromiseToCdn({
                  fileUploadPromise: args.input.avatar.upload!,
                  maxSizeBytes: 5 * DataSize.MB,
                });
              }
            }

            await updateEBoard({
              entityManager: transEntityManager,
              filter: { id: args.input.id },
              changes: {
                ...(isDefined(args.input.avatar) && {
                  avatarLink: avatarSelfHostedFilePath,
                }),
                ...(isDefined(args.input.bio) && { bio: args.input.bio }),
              },
              subFuncQueue: postTransFuncQueue,
            });
          },
        );
        if (error instanceof Error) throw new HttpError(400, error.message);
      });
      return true;
    },

    deleteEBoard: async (parent, args, context: ApolloResolversContext, info) => {
      const eBoard = await context.unsecureEntityManager.eBoard.findOne({
        filter: { id: args.id },
      });
      if (!eBoard) throw new HttpError(400, "EBoard doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: eBoard.userId,
        })
        .assertPermission(Permission.ManageEboard);

      const error = startEntityManagerTransactionGraphQL(context, async (transEntityManager, postTransFuncQueue) => {
        await deleteEBoard({
          entityManager: transEntityManager,
          filter: { id: args.id },
          subFuncQueue: postTransFuncQueue,
        });
      });
      if (error instanceof Error) throw new HttpError(400, error.message);
      return true;
    },

    newEBoardTerm: async (parent, args, context: ApolloResolversContext, info) => {
      const eBoard = await context.unsecureEntityManager.eBoard.findOne({
        filter: { id: args.input.eBoardId },
      });
      if (!eBoard) throw new HttpError(400, "eBoard doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: eBoard?.userId,
        })
        .assertPermission(Permission.ManageEboard);

      const exists = await context.unsecureEntityManager.eBoardTerm.exists({
        filter: {
          eBoardId: args.input.eBoardId,
          year: args.input.year,
        },
      });
      if (exists) throw new HttpError(400, 'EBoard term already exists for this eboard member!');

      let eBoardTermId = '';
      const error = startEntityManagerTransactionGraphQL(context, async (transEntityManager, postTransFuncQueue) => {
        const eBoardTerm = await makeEBoardTerm({
          entityManager: transEntityManager,
          record: args.input,
          subFuncQueue: postTransFuncQueue,
        });
        eBoardTermId = eBoardTerm.id;
      });
      if (error instanceof Error) throw new HttpError(400, error.message);
      return eBoardTermId;
    },

    updateEBoardTerm: async (parent, args, context: ApolloResolversContext, info) => {
      const eBoardTerm = await context.unsecureEntityManager.eBoardTerm.findOne({
        filter: { id: args.input.id },
        projection: {
          eBoard: {
            userId: true,
          },
        },
      });
      if (!eBoardTerm) throw new HttpError(400, "EBoard term doesn't exist!");

      const permCalc = makePermsCalc().withContext(context.securityContext).withDomain({
        userId: eBoardTerm.eBoard.userId,
      });
      permCalc.assertPermission(Permission.ManageEboard);

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          if (!context.securityContext.userId) throw new HttpError(400, 'Expected context.securityContext.userId!');

          if (isDefined(args.input.roles)) {
            permCalc.assertPermission(Permission.ManageEboardRoles);
            const requesterRoleCodes = await getRequesterRoles(
              transEntityManager,
              context.securityContext.userId,
              args.input.id,
            );
            if (!args.input.roles.some((x) => x === RoleCode.Eboard))
              throw new HttpError(400, 'Eboard must have Eboard role!');
            assertRolesAreOfType(args.input.roles, RoleType.EBoard);
            assertRequesterCanManageRoleCodes(requesterRoleCodes, args.input.roles);
          }

          await updateEBoardTerm({
            entityManager: transEntityManager,
            filter: { id: args.input.id },
            changes: {
              ...(isDefined(args.input.year) && { year: args.input.year }),
            },
            roles: args.input.roles,
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);
      return true;
    },

    deleteEBoardTerm: async (parent, args, context: ApolloResolversContext, info) => {
      const eBoardTerm = await context.unsecureEntityManager.eBoardTerm.findOne({
        filter: { id: args.id },
        projection: {
          eBoardId: true,
          eBoard: {
            userId: true,
          },
        },
      });
      if (!eBoardTerm) throw new HttpError(400, "EBoard term doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: eBoardTerm.eBoard.userId,
        })
        .assertPermission(Permission.ManageEboard);

      const error = await startEntityManagerTransactionGraphQL(
        context,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteEBoardTerm({
            entityManager: transEntityManager,
            filter: { id: args.id },
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);
      return true;
    },
  },

  Subscription: {
    eBoardCreated: makeSubscriptionResolver().pubsub(PubSubEvents.EBoardCreated).shallowOneToOneFilter().build(),

    eBoardUpdated: makeSubscriptionResolver().pubsub(PubSubEvents.EBoardUpdated).shallowOneToOneFilter().build(),

    eBoardDeleted: makeSubscriptionResolver().pubsub(PubSubEvents.EBoardCreated).shallowOneToOneFilter().build(),

    eBoardTermCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.EBoardTermCreated)
      .shallowOneToOneFilter()
      .build(),

    eBoardTermUpdated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.EBoardTermUpdated)
      .shallowOneToOneFilter()
      .build(),

    eBoardTermDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.EBoardTermCreated)
      .shallowOneToOneFilter()
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function makeEBoard(options: {
  entityManager: EntityManager;
  record: EBoardInsert;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, record, emitSubscription = true, subFuncQueue } = options;
  const eBoard = await entityManager.eBoard.insertOne({ record });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardCreated, eBoard, subFuncQueue);
  return eBoard;
}

export async function updateEBoard(options: {
  entityManager: EntityManager;
  filter: EBoardFilter;
  changes: EBoardUpdate;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, changes, emitSubscription = true, subFuncQueue } = options;
  await entityManager.eBoard.updateOne({ filter, changes });
  const updatedEBoard = await entityManager.eBoard.findOne({ filter });
  if (!updateEBoard) throw new HttpError(400, 'Expected EBoard to not be null during update!');
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardUpdated, updatedEBoard, subFuncQueue);
}

export async function deleteEBoard(options: {
  entityManager: EntityManager;
  filter: EBoardFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const eBoard = await entityManager.eBoard.findOne({ filter });
  if (!eBoard) throw new HttpError(400, 'Expected EBoard to not be null during delete');
  tryDeleteFileIfSelfHosted(eBoard.avatarLink);
  await deleteAllEBoardTerms({
    entityManager: entityManager,
    filter: {
      eBoardId: eBoard.id,
    },
    subFuncQueue,
  });
  await entityManager.eBoard.deleteOne({ filter: filter });
  if (emitSubscription) {
    pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardDeleted, eBoard, subFuncQueue);
  }
}

export async function deleteAllEBoards(options: {
  entityManager: EntityManager;
  filter: EBoardFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const eBoards = await entityManager.eBoard.findAll({ filter });
  for (const eBoard of eBoards) {
    tryDeleteFileIfSelfHosted(eBoard.avatarLink);
    await deleteAllEBoardTerms({
      entityManager: entityManager,
      filter: {
        eBoardId: eBoard.id,
      },
      subFuncQueue,
    });
  }
  await entityManager.eBoard.deleteAll({ filter: filter });
  if (emitSubscription) {
    for (const eBoard of eBoards) pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardDeleted, eBoard, subFuncQueue);
  }
}

export async function makeEBoardTerm(options: {
  entityManager: EntityManager;
  record: EBoardTermInsert;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, record, emitSubscription = true, subFuncQueue } = options;

  const term = await entityManager.eBoardTerm.insertOne({ record: record });
  await entityManager.eBoardTermRole.insertOne({
    record: {
      termId: term.id,
      roleCode: RoleCode.Eboard,
    },
  });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardTermCreated, term, subFuncQueue);
  return term;
}

export async function updateEBoardTerm(options: {
  entityManager: EntityManager;
  filter: EBoardTermFilter;
  changes: EBoardTermUpdate;
  roles?: RoleCode[] | null;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, changes, roles, emitSubscription = true, subFuncQueue } = options;
  await entityManager.eBoardTerm.updateOne({ filter, changes });
  const updatedEBoardTerm = await entityManager.eBoardTerm.findOne({ filter });
  if (!updatedEBoardTerm) throw new HttpError(400, 'Expected EBoardTerm to not be null during update!');
  if (roles)
    await daoInsertRolesBatch({
      dao: entityManager.eBoardTermRole,
      roleCodes: roles,
      idKey: 'termId',
      id: updatedEBoardTerm.id,
    });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardTermUpdated, updatedEBoardTerm, subFuncQueue);
}

export async function deleteEBoardTerm(options: {
  entityManager: EntityManager;
  filter: EBoardTermFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const term = await entityManager.eBoardTerm.findOne({ filter });
  if (!term) throw new HttpError(400, 'Expected EBoardTerm to not be null during delete!');
  await entityManager.eBoardTermRole.deleteOne({
    filter: { termId: term.id },
  });
  await entityManager.eBoardTerm.deleteOne({ filter });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardTermDeleted, term, subFuncQueue);
}

export async function deleteAllEBoardTerms(options: {
  entityManager: EntityManager;
  filter: EBoardTermFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const terms = await entityManager.eBoardTerm.findAll({ filter });
  await entityManager.eBoardTermRole.deleteAll({
    filter: { termId: { in: terms.map((x) => x.id) } },
  });
  await entityManager.eBoardTerm.deleteAll({ filter });
  if (emitSubscription)
    for (const term of terms) pubsub.publishOrAddToFuncQueue(PubSubEvents.EBoardTermDeleted, term, subFuncQueue);
}
