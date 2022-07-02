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
  EBoardPlainModel,
  EBoardTermFilter,
  EBoardTermInsert,
  EBoardTermPlainModel,
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
  isDefined,
  startEntityManagerTransaction,
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
          userId: [args.input.userId],
        })
        .assertPermission(Permission.ManageEboard);

      const exists = await context.unsecureEntityManager.eBoard.exists({
        filter: { userId: args.input.userId },
      });
      if (exists) throw new HttpError(400, 'EBoard already exists for this user!');

      let eBoard: EBoardPlainModel | undefined;
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntitymanager) => {
          eBoard = await makeEBoard(transEntitymanager, args.input);
        },
      );

      if (error) throw error;

      pubsub.publish(PubSubEvents.EBoardCreated, eBoard);

      return eBoard?.id;
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

        const permCalc = makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({
            userId: [eBoard.userId],
          });

        permCalc.assertPermission(Permission.ManageEboard);

        const error = await startEntityManagerTransaction(
          context.unsecureEntityManager,
          context.mongoClient,
          async (transEntityManager) => {
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

            await transEntityManager.eBoard.updateOne({
              filter: { id: args.input.id },
              changes: {
                ...(isDefined(args.input.avatar) && {
                  avatarLink: avatarSelfHostedFilePath,
                }),
                ...(isDefined(args.input.bio) && { bio: args.input.bio }),
              },
            });
          },
        );
        if (error) throw error;
      });

      const updatedEBoard = await context.unsecureEntityManager.eBoard.findOne({
        filter: { id: args.input.id },
      });
      pubsub.publish(PubSubEvents.EBoardUpdated, updatedEBoard);

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
          userId: [eBoard.userId],
        })
        .assertPermission(Permission.ManageEboard);

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          await deleteEBoard(transEntityManager, { id: args.id });
        },
      );
      if (error) throw error;

      pubsub.publish(PubSubEvents.EBoardDeleted, eBoard);

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
          userId: [eBoard?.userId],
        })
        .assertPermission(Permission.ManageEboard);

      const exists = await context.unsecureEntityManager.eBoardTerm.exists({
        filter: {
          eBoardId: args.input.eBoardId,
          year: args.input.year,
        },
      });
      if (exists) throw new HttpError(400, 'EBoard term already exists for this eboard member!');

      let eBoardTerm: EBoardTermPlainModel | undefined;
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntitymanager) => {
          eBoardTerm = await makeEBoardTerm(transEntitymanager, args.input);
        },
      );

      if (error) throw error;

      return eBoard?.id;
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

      const permCalc = makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [eBoardTerm.eBoard.userId],
        });
      permCalc.assertPermission(Permission.ManageEboard);

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
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
            await daoInsertRolesBatch({
              dao: transEntityManager.eBoardTermRole,
              roleCodes: args.input.roles,
              idKey: 'termId',
              id: args.input.id,
            });
          }

          await transEntityManager.eBoardTerm.updateOne({
            filter: { id: args.input.id },
            changes: {
              ...(isDefined(args.input.year) && { year: args.input.year }),
            },
          });
        },
      );
      if (error) throw error;

      const updatedEBoardTerm = await context.unsecureEntityManager.eBoardTerm.findOne({
        filter: { id: args.input.id },
      });
      pubsub.publish(PubSubEvents.EBoardTermUpdated, updatedEBoardTerm);

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
          userId: [eBoardTerm.eBoard.userId],
        })
        .assertPermission(Permission.ManageEboard);

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          await deleteEBoardTerm(transEntityManager, { id: args.id });
        },
      );
      if (error) throw error;

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

export async function makeEBoard(entityManager: EntityManager, record: EBoardInsert, emitSubscription: boolean = true) {
  const eBoard = await entityManager.eBoard.insertOne({
    record,
  });

  if (emitSubscription) pubsub.publish(PubSubEvents.EBoardCreated, eBoard);
  return eBoard;
}

export async function deleteEBoard(
  entityManager: EntityManager,
  filter: EBoardFilter,
  emitSubscription: boolean = true,
) {
  const eBoards = await entityManager.eBoard.findAll({ filter });
  for (const eBoard of eBoards) {
    tryDeleteFileIfSelfHosted(eBoard.avatarLink);
    deleteEBoardTerm(entityManager, {
      eBoardId: eBoard.id,
    });
  }
  await entityManager.eBoard.deleteAll({ filter });

  if (emitSubscription) {
    for (const eBoard of eBoards) pubsub.publish(PubSubEvents.EBoardDeleted, eBoard);
  }
}

export async function makeEBoardTerm(
  entityManager: EntityManager,
  record: EBoardTermInsert,
  emitSubscription: boolean = true,
) {
  const term = await entityManager.eBoardTerm.insertOne({ record });
  await entityManager.eBoardTermRole.insertOne({
    record: {
      termId: term.id,
      roleCode: RoleCode.Eboard,
    },
  });
  if (emitSubscription) pubsub.publish(PubSubEvents.EBoardTermCreated, term);
  return term;
}

export async function deleteEBoardTerm(
  entityManager: EntityManager,
  filter: EBoardTermFilter,
  emitSubscription: boolean = true,
) {
  const terms = await entityManager.eBoardTerm.findAll({ filter });
  await entityManager.eBoardTermRole.deleteAll({
    filter: { termId: { in: terms.map((x) => x.id) } },
  });
  await entityManager.eBoardTerm.deleteAll({ filter });

  if (emitSubscription) for (const term of terms) pubsub.publish(PubSubEvents.EBoardTermDeleted, term);
}
