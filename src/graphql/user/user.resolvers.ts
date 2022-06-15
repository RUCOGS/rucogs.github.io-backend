import { DataSize, fileUploadPromiseToCdn, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';
import { MutationResolvers, Permission, QueryResolvers, RoleCode, SubscriptionResolvers, UpdateUserSocialInput, UploadOperation } from '@src/generated/graphql-endpoint.types';
import { EntityManager, UserSocialFilter, UserSocialInsert } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { assertNoDuplicates } from '@src/shared/validation';
import { assertRequesterCanDeleteRoleCodes, assertRequesterCanManageRoleCodes, daoInsertBatch, daoInsertRolesBatch, deleteEntityRoleResolver, EntityRoleResolverOptions, getEntityRoleCodes, getRoleCodes, isDefined, newEntityRoleResolver, startEntityManagerTransaction } from '@src/utils';
import { HttpError } from '@src/shared/utils';
import { makeSubscriptionResolver } from '../subscription-resolver-builder';
import pubsub, { PubSubEvents } from '../pubsub';

const roleResolverOptions = <EntityRoleResolverOptions>{
  entityCamelCaseName: "user",
  async getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
    return getEntityRoleCodes(unsecureEntityManager.userRole, "userId", requesterUserId);
  }
};

export default {
  Mutation: {
    updateUser: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [ args.input.id ]
        })
        .assertPermission(Permission.UpdateUser);

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
                { 
                  $nor: args.input.socials.map(x => ({ 
                    username: x.username,
                    platform: x.platform,
                  }))
                }
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
      
      pubsub.publish(PubSubEvents.UserUpdated, { userUpdated: args.input.id });
      return true;
    },
    newUserRole: newEntityRoleResolver(roleResolverOptions),
    deleteUserRole: deleteEntityRoleResolver(roleResolverOptions)
  },

  Subscription: {
    userCreated: {
      subscribe: makeSubscriptionResolver()
        .pubsub(PubSubEvents.UserCreated)
        .shallowFilter("userCreated")
        .build()
    },
    
    userUpdated: {
      subscribe: makeSubscriptionResolver()
        .pubsub(PubSubEvents.UserUpdated)
        .shallowFilter("userUpdated")
        .build()
    },

    userDeleted: {
      subscribe: makeSubscriptionResolver()
        .pubsub(PubSubEvents.UserCreated)
        .shallowFilter("userDeleted")
        .build()
    }
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers, Subscription: SubscriptionResolvers };