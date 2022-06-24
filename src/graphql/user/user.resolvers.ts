import { DataSize, fileUploadPromiseToCdn, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';
import { MutationResolvers, Permission, QueryResolvers, RoleCode, SubscriptionResolvers, UpdateUserSocialInput, UploadOperation } from '@src/generated/graphql-endpoint.types';
import { EntityManager, UserSocialFilter, UserSocialInsert } from '@src/generated/typetta';
import { deleteProjectInvites } from '@src/graphql/project-invite/project-invite.resolvers';
import pubsub, { PubSubEvents } from '@src/graphql/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { assertNoDuplicates } from '@src/shared/validation';
import { assertRequesterCanManageRoleCodes, daoInsertBatch, daoInsertRolesBatch, deleteEntityRoleResolver, EntityRoleResolverOptions, getEntityRoleCodes, isDefined, newEntityRoleResolver, startEntityManagerTransaction } from '@src/utils';

const roleResolverOptions = <EntityRoleResolverOptions>{
  entityCamelCaseName: "user",
  permission: Permission.ManageUserRoles,
  async getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
    return getEntityRoleCodes(unsecureEntityManager.userRole, "userId", requesterUserId);
  }
};

export default {
  Mutation: {
    updateUser: async (parent, args, context: ApolloResolversContext, info) => {
      const permCalc = makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [ args.input.id ]
        });
      
      permCalc.assertPermission(Permission.UpdateUser);

      if (isDefined(args.input.roles))
        permCalc.assertPermission(Permission.ManageUserRoles);

      const user = await context.unsecureEntityManager.user.findOne({
        filter: {
          id: args.input.id
        },
        projection: {
          avatarLink: true,
          bannerLink: true,
        }
      });
      if (!user) {
        throw new HttpError(401, "Invalid userId!");
      }

      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        if (!context.securityContext.userId)
          throw new HttpError(400, "Expected context.securityContext.userId!");

        if (isDefined(args.input.displayName)) {
          if (args.input.displayName === "")
            throw new HttpError(400, "displayName cannot be empty!");
        }

        if (isDefined(args.input.roles)) {
          const requesterRoleCodes = await roleResolverOptions.getRequesterRoles(transEntityManager, context.securityContext.userId, context.securityContext.userId);
          if (!args.input.roles.some(x => x === RoleCode.User))
            throw new HttpError(400, "User must have User role!");
          assertRequesterCanManageRoleCodes(requesterRoleCodes, args.input.roles);
          await daoInsertRolesBatch({
            dao: transEntityManager.userRole,
            roleCodes: args.input.roles,
            idKey: "userId",
            id: args.input.id
          });
        }

        if (isDefined(args.input.socials)) {
          assertNoDuplicates(
            args.input.socials, 
            (a, b) => {
              return a.username === b.username && a.platform === b.platform
            }, 
            "Cannot have duplicate user socials with identical usernames and platforms!"
          );
          
          await daoInsertBatch({
            dao: transEntityManager.userSocial,
            elements: args.input.socials,
            deleteFilter: {
              $and: [
                { 
                  userId: args.input.id, 
                },
                ...(args.input.socials.length > 0 ? [{ 
                  $nor: args.input.socials.map(x => ({ 
                    username: x.username,
                    platform: x.platform,
                  }))
                }] : [])
              ]
            },
            elementToUpdateFilter: (social: UpdateUserSocialInput): UserSocialFilter => ({
              userId: args.input.id,
              platform: social.platform,
              username: social.username
            }),
            elementToRecord: (social: UpdateUserSocialInput): UserSocialInsert => ({
              ...social,
              userId: args.input.id
            })
          });
        }

        let avatarSelfHostedFilePath = "";
        if (isDefined(args.input.avatar)) {
          if (args.input.avatar.operation === UploadOperation.Insert ||
            args.input.avatar.operation === UploadOperation.Delete)
            tryDeleteFileIfSelfHosted(user.avatarLink);
          
          if (args.input.avatar.operation === UploadOperation.Insert) {
            avatarSelfHostedFilePath = await fileUploadPromiseToCdn({
              fileUploadPromise: args.input.avatar.upload!,
              maxSizeBytes: 5 * DataSize.MB
            });
          }
        }

        let bannerSelfHostedFilePath = "";
        if (isDefined(args.input.banner)) {
          if (args.input.banner.operation === UploadOperation.Insert ||
            args.input.banner.operation === UploadOperation.Delete)
            tryDeleteFileIfSelfHosted(user.bannerLink);
          
          if (args.input.banner.operation === UploadOperation.Insert) {
            bannerSelfHostedFilePath = await fileUploadPromiseToCdn({
              fileUploadPromise: args.input.banner.upload,
              maxSizeBytes: 10 * DataSize.MB
            });  
          }
        }

      await transEntityManager.user.updateOne({
        filter: {
          id: args.input.id
        },
        changes: {
          ...(isDefined(args.input.displayName) && { displayName: args.input.displayName }),
          ...(isDefined(args.input.bio) && { bio: args.input.bio }),
          ...(isDefined(args.input.avatar) && { avatarLink: avatarSelfHostedFilePath}),
          ...(isDefined(args.input.banner) && { bannerLink: bannerSelfHostedFilePath}),
        }
      })
      });
      if (error instanceof Error)
        throw error;
      
      const updatedUser = await context.unsecureEntityManager.user.findOne({
        filter: { id: args.input.id }
      })
      pubsub.publish(PubSubEvents.UserUpdated, updatedUser);
      return true;
    },
    deleteUser: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [ args.id ]
        })
        .assertPermission(Permission.DeleteUser);

      const user = await context.unsecureEntityManager.user.findOne({
        filter: {
          id: args.id
        }
      });
      if (!user) {
        throw new HttpError(401, "Invalid userId!");
      }

      const userProjectMemberExists = await context.unsecureEntityManager.projectMember.exists({
        filter: {
          userId: args.id
        }
      });
      if (userProjectMemberExists)
        throw new HttpError(401, "Cannot delete user that is in a project!");

      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        await transEntityManager.userRole.deleteAll({
          filter: {
            userId: args.id
          }
        });

        await transEntityManager.eBoard.deleteAll({
          filter: {
            userId: args.id
          }
        });

        await transEntityManager.userLoginIdentity.deleteAll({
          filter: {
            userId: args.id
          }
        })

        await deleteProjectInvites(transEntityManager, {
          userId: args.id
        });

        await transEntityManager.user.deleteOne({
          filter: {
            id: args.id
          }
        });
      });
      if (error instanceof Error)
        throw error;
      
      pubsub.publish(PubSubEvents.UserDeleted, user);
      return true;
    },
    newUserRole: newEntityRoleResolver(roleResolverOptions),
    deleteUserRole: deleteEntityRoleResolver(roleResolverOptions)
  },

  Subscription: {
    userCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserCreated)
      .shallowOneToOneFilter()
      .mapId()
      .build(),
    
    userUpdated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserUpdated)
      .shallowOneToOneFilter()
      .mapId()
      .build(),

    userDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.UserDeleted)
      .shallowOneToOneFilter()
      .mapId()
      .build()
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers, Subscription: SubscriptionResolvers };