import { DataSize, fileUploadPromiseToCdn, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';
import {
  MutationResolvers,
  Permission,
  QueryResolvers,
  RoleCode,
  SubscriptionResolvers,
  UpdateUserSocialInput,
  UploadOperation,
} from '@src/generated/graphql-endpoint.types';
import { EntityManager, UserInsert, UserSocialFilter, UserSocialInsert } from '@src/generated/typetta';
import { deleteProjectInvites } from '@src/graphql/project-invite/project-invite.resolvers';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc, RoleType } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { assertNoDuplicates } from '@src/shared/validation';
import {
  assertRequesterCanManageRoleCodes,
  assertRolesAreOfType,
  daoInsertBatch,
  daoInsertRolesBatch,
  getEntityRoleCodes,
  isDefined,
  startEntityManagerTransaction,
} from '@src/utils';
import AsyncLock from 'async-lock';
import { deleteEBoard } from '../e-board/e-board.resolvers';

async function getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
  return getEntityRoleCodes(unsecureEntityManager.userRole, 'userId', requesterUserId);
}

const updateUserLock = new AsyncLock();

export default {
  Mutation: {
    newUser: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc().withContext(context.securityContext).assertPermission(Permission.CreateUser);

      let userId: string | undefined;
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          const user = await makeUser(transEntityManager, args.input);
          userId = user.id;
        },
      );
      if (error) throw error;

      return userId;
    },

    updateUser: async (parent, args, context: ApolloResolversContext, info) => {
      await updateUserLock.acquire('lock', async () => {
        const permCalc = makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({
            userId: [args.input.id],
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

        const error = await startEntityManagerTransaction(
          context.unsecureEntityManager,
          context.mongoClient,
          async (transEntityManager) => {
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

            await transEntityManager.user.updateOne({
              filter: {
                id: args.input.id,
              },
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
            });
          },
        );
        if (error instanceof Error) throw error;
      });

      const updatedUser = await context.unsecureEntityManager.user.findOne({
        filter: { id: args.input.id },
      });
      pubsub.publish(PubSubEvents.UserUpdated, updatedUser);
      return true;
    },

    deleteUser: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [args.id],
        })
        .assertPermission(Permission.DeleteUser);

      const user = await context.unsecureEntityManager.user.findOne({
        filter: {
          id: args.id,
        },
      });
      if (!user) {
        throw new HttpError(401, 'Invalid userId!');
      }

      const userProjectMemberExists = await context.unsecureEntityManager.projectMember.exists({
        filter: {
          userId: args.id,
        },
      });
      if (userProjectMemberExists) throw new HttpError(401, 'Cannot delete user that is in a project!');

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          await transEntityManager.userRole.deleteAll({
            filter: {
              userId: args.id,
            },
          });

          await deleteEBoard(transEntityManager, {
            userId: args.id,
          });

          await transEntityManager.userLoginIdentity.deleteAll({
            filter: {
              userId: args.id,
            },
          });

          await deleteProjectInvites(transEntityManager, {
            userId: args.id,
          });

          tryDeleteFileIfSelfHosted(user.avatarLink);
          tryDeleteFileIfSelfHosted(user.bannerLink);

          await transEntityManager.user.deleteOne({
            filter: {
              id: args.id,
            },
          });
        },
      );
      if (error instanceof Error) throw error;

      pubsub.publish(PubSubEvents.UserDeleted, user);
      return true;
    },
  },

  Subscription: {
    userCreated: makeSubscriptionResolver().pubsub(PubSubEvents.UserCreated).shallowOneToOneFilter().mapId().build(),

    userUpdated: makeSubscriptionResolver().pubsub(PubSubEvents.UserUpdated).shallowOneToOneFilter().mapId().build(),

    userDeleted: makeSubscriptionResolver().pubsub(PubSubEvents.UserDeleted).shallowOneToOneFilter().mapId().build(),
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
