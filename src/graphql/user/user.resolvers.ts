import { DataSize, fileUploadPromiseToCdn, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';
import { jwtSignAsync } from '@src/controllers/jwt.controller';
import { clearSecurityContext } from '@src/controllers/security.controller';
import { VerityNetIdPayload } from '@src/controllers/verify-netid.controller';
import {
  MutationResolvers,
  Permission,
  QueryResolvers,
  RoleCode,
  SubscriptionResolvers,
  UpdateUserSocialInput,
  UploadOperation,
} from '@src/generated/graphql-endpoint.types';
import { SubscriptionUserCreatedArgs } from '@src/generated/model.types';
import {
  EntityManager,
  UserFilter,
  UserInsert,
  UserSocialFilter,
  UserSocialInsert,
  UserUpdate,
} from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { RoleType, makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { assertNetId, assertNoDuplicates } from '@src/shared/validation';
import {
  FuncQueue,
  assertRequesterCanManageRoleCodes,
  assertRolesAreOfType,
  daoInsertBatch,
  daoInsertRolesBatch,
  getEntityRoleCodes,
  isDefined,
  startEntityManagerTransactionGraphQL,
} from '@src/utils';
import AsyncLock from 'async-lock';
import { deleteAllEBoards } from '../e-board/e-board.resolvers';
import { deleteAllProjectInvites } from '../project-invite/project-invite.resolvers';
import { deleteAllUserLoginIdentity as deleteAllUserLoginIdentities } from '../user-login-identity/user-login-identity.resolvers';

async function getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
  return getEntityRoleCodes(unsecureEntityManager.userRole, 'userId', requesterUserId);
}

const updateUserLock = new AsyncLock();

// Add verification for subscriptions because it can contain private information
async function verifySub(parent: any, args: SubscriptionUserCreatedArgs, context: ApolloResolversContext, info: any) {
  if (!args.filter || Object.keys(args.filter).length == 0) {
    makePermsCalc().withContext(context.securityContext).assertPermission(Permission.UpdateUser);
    return;
  }

  makePermsCalc()
    .withContext(context.securityContext)
    .withDomain({
      userId: args.filter.id!,
    })
    .assertPermission(Permission.UpdateUser);
}

export default {
  Query: {
    userCount: async (parent, args, context: ApolloResolversContext, info) => {
      return context.unsecureEntityManager.user.count();
    },
  },
  Mutation: {
    newUser: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc().withContext(context.securityContext).assertPermission(Permission.CreateUser);

      let userId = '';
      const error = await startEntityManagerTransactionGraphQL(
        context,
        async (transEntityManager, postTransFuncQueue) => {
          const user = await makeUser({
            entityManager: transEntityManager,
            record: args.input,
            subFuncQueue: postTransFuncQueue,
          });
          userId = userId;
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);

      return userId;
    },

    updateUser: async (parent, args, context: ApolloResolversContext, info) => {
      await updateUserLock.acquire('lock', async () => {
        const permCalc = makePermsCalc().withContext(context.securityContext).withDomain({
          userId: args.input.id,
        });

        permCalc.assertPermission(Permission.UpdateUser);
        if (args.input.createdAt) permCalc.assertPermission(Permission.ManageMetadata);
        if (args.input.email) permCalc.assertPermission(Permission.UpdateUserPrivate);

        const user = await context.unsecureEntityManager.user.findOne({
          filter: {
            id: args.input.id,
          },
          projection: {
            avatarLink: true,
            bannerLink: true,
          },
        });
        if (!user) {
          throw new HttpError(401, 'Invalid userId!');
        }

        const error = await startEntityManagerTransactionGraphQL(
          context,
          async (transEntityManager, postTransFuncQueue) => {
            if (!context.securityContext.userId) throw new HttpError(400, 'Expected context.securityContext.userId!');

            if (isDefined(args.input.displayName)) {
              if (args.input.displayName === '') throw new HttpError(400, 'displayName cannot be empty!');
            }

            if (isDefined(args.input.roles)) {
              permCalc.assertPermission(Permission.ManageUserRoles);
              const requesterRoleCodes = await getRequesterRoles(
                transEntityManager,
                context.securityContext.userId,
                context.securityContext.userId,
              );
              if (!args.input.roles.some((x) => x === RoleCode.User))
                throw new HttpError(400, 'User must have User role!');
              assertRolesAreOfType(args.input.roles, RoleType.User);
              assertRequesterCanManageRoleCodes(requesterRoleCodes, args.input.roles);
              await daoInsertRolesBatch({
                dao: transEntityManager.userRole,
                roleCodes: args.input.roles,
                idKey: 'userId',
                id: args.input.id,
              });
            }

            if (isDefined(args.input.socials)) {
              assertNoDuplicates(
                args.input.socials,
                (a, b) => {
                  return a.username === b.username && a.platform === b.platform;
                },
                'Cannot have duplicate user socials with identical usernames and platforms!',
              );

              await daoInsertBatch({
                dao: transEntityManager.userSocial,
                elements: args.input.socials,
                deleteFilter: {
                  $and: [
                    {
                      userId: args.input.id,
                    },
                    ...(args.input.socials.length > 0
                      ? [
                          {
                            $nor: args.input.socials.map((x) => ({
                              username: x.username,
                              platform: x.platform,
                            })),
                          },
                        ]
                      : []),
                  ],
                },
                elementToUpdateFilter: (social: UpdateUserSocialInput): UserSocialFilter => ({
                  userId: args.input.id,
                  platform: social.platform,
                  username: social.username,
                }),
                elementToRecord: (social: UpdateUserSocialInput): UserSocialInsert => ({
                  ...social,
                  userId: args.input.id,
                }),
              });
            }

            let avatarSelfHostedFilePath = null;
            if (isDefined(args.input.avatar)) {
              if (
                args.input.avatar.operation === UploadOperation.Insert ||
                args.input.avatar.operation === UploadOperation.Delete
              ) {
                void tryDeleteFileIfSelfHosted(user.avatarLink);
              }

              if (args.input.avatar.operation === UploadOperation.Insert) {
                avatarSelfHostedFilePath = await fileUploadPromiseToCdn({
                  fileUploadPromise: args.input.avatar.upload,
                  maxSizeBytes: 5 * DataSize.MB,
                });
              }
            }

            let bannerSelfHostedFilePath = null;
            if (isDefined(args.input.banner)) {
              if (
                args.input.banner.operation === UploadOperation.Insert ||
                args.input.banner.operation === UploadOperation.Delete
              ) {
                void tryDeleteFileIfSelfHosted(user.bannerLink);
              }

              if (args.input.banner.operation === UploadOperation.Insert) {
                bannerSelfHostedFilePath = await fileUploadPromiseToCdn({
                  fileUploadPromise: args.input.banner.upload,
                  maxSizeBytes: 10 * DataSize.MB,
                });
              }
            }

            await updateUser({
              entityManager: transEntityManager,
              filter: { id: args.input.id },
              changes: {
                ...(isDefined(args.input.email) && {
                  email: args.input.email,
                }),
                ...(isDefined(args.input.createdAt) && {
                  createdAt: args.input.createdAt,
                }),
                ...(isDefined(args.input.classYear) && {
                  classYear: args.input.classYear,
                }),
                ...(isDefined(args.input.displayName) && {
                  displayName: args.input.displayName,
                }),
                ...(isDefined(args.input.bio) && { bio: args.input.bio }),
                ...(isDefined(args.input.avatar) && {
                  avatarLink: avatarSelfHostedFilePath,
                }),
                ...(isDefined(args.input.banner) && {
                  bannerLink: bannerSelfHostedFilePath,
                }),
              },
              subFuncQueue: postTransFuncQueue,
            });
          },
        );
        if (error instanceof Error) throw new HttpError(400, error.message);

        if (isDefined(args.input.roles)) {
          clearSecurityContext(context.unsecureEntityManager, args.input.id);
        }
      });
      return true;
    },

    deleteUser: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: args.id,
        })
        .assertPermission(Permission.DeleteUser);

      const userExists = await context.unsecureEntityManager.user.exists({
        filter: {
          id: args.id,
        },
      });
      if (!userExists) {
        throw new HttpError(401, 'Invalid userId!');
      }

      const userProjectMemberExists = await context.unsecureEntityManager.projectMember.exists({
        filter: {
          userId: args.id,
        },
      });
      if (userProjectMemberExists) throw new HttpError(401, 'Cannot delete user that is in a project!');

      const error = await startEntityManagerTransactionGraphQL(
        context,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteUser({
            entityManager: transEntityManager,
            filter: { id: args.id },
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);

      return true;
    },

    verifyNetId: async (parent, args, context: ApolloResolversContext, info) => {
      if (!args.input.userId) args.input.userId = context.securityContext.userId;
      if (!args.input.userId) throw new HttpError(400, 'Expected a userId or a request that was sent by a user!');

      assertNetId(args.input.netId);

      const existsNetId = await context.unsecureEntityManager.user.exists({
        filter: {
          netId: args.input.netId,
        },
      });
      if (existsNetId) throw new HttpError(400, 'NetID is already linked to an account!');

      const rutgersEmail = args.input.netId + `@rutgers.edu`;

      const user = await context.unsecureEntityManager.user.findOne({
        filter: { id: args.input.userId },
        projection: {
          displayName: true,
        },
      });

      const token = await jwtSignAsync<VerityNetIdPayload>(
        {
          userId: args.input.userId,
          netId: args.input.netId,
        },
        '1hr',
      );

      // Link for verification
      const link = new URL(context.serverConfig.backendDomain + '/auth/verify-netid');
      link.searchParams.append('token', token);

      await context.mailController
        .withOptions({
          to: `${user?.displayName} <${rutgersEmail}>`,
          subject: 'Verify NetID for COGS Account',
        })
        .withTemplate('verify-rutgers', {
          name: user?.displayName ?? 'user',
          link,
        })
        .sendMail();

      return true;
    },
  },

  Subscription: {
    userCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserCreated)
      .shallowOneToOneFilter()
      .secure(verifySub)
      .build(),

    userUpdated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserUpdated)
      .shallowOneToOneFilter()
      .secure(verifySub)
      .build(),

    userDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserDeleted)
      .shallowOneToOneFilter()
      .secure(verifySub)
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function makeUser(options: {
  entityManager: EntityManager;
  record: UserInsert;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, record, emitSubscription = true, subFuncQueue } = options;
  const user = await entityManager.user.insertOne({ record });
  await entityManager.userRole.insertOne({
    record: {
      roleCode: RoleCode.User,
      userId: user.id,
    },
  });
  subFuncQueue?.addFunc(async () => clearSecurityContext(entityManager, user.id));
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.UserCreated, user, subFuncQueue);
  return user;
}

export async function updateUser(options: {
  entityManager: EntityManager;
  filter: UserFilter;
  changes: UserUpdate;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, changes, emitSubscription = true, subFuncQueue } = options;
  await entityManager.user.updateOne({ filter, changes });
  const updatedUser = await entityManager.user.findOne({ filter });
  if (!updatedUser) throw new HttpError(400, 'Expected User to not be null during update!');
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.UserUpdated, updatedUser, subFuncQueue);
}

export async function deleteUser(options: {
  entityManager: EntityManager;
  filter: UserFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const user = await entityManager.user.findOne({ filter });
  if (!user) throw new HttpError(400, 'Expected User to not be null during delete!');
  await entityManager.userRole.deleteAll({
    filter: { userId: user.id },
  });
  await deleteAllEBoards({
    entityManager,
    filter: { userId: user.id },
    subFuncQueue,
  });
  await deleteAllUserLoginIdentities({
    entityManager,
    filter: { userId: user.id },
    subFuncQueue,
  });
  await deleteAllProjectInvites({
    entityManager,
    filter: { userId: user.id },
    subFuncQueue,
  });
  tryDeleteFileIfSelfHosted(user.avatarLink);
  tryDeleteFileIfSelfHosted(user.bannerLink);
  await entityManager.user.deleteOne({
    filter: { id: user.id },
  });
  subFuncQueue?.addFunc(async () => await clearSecurityContext(entityManager, user.id));
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.UserDeleted, user, subFuncQueue);
  return user;
}
