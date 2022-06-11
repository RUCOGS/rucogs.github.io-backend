import { DataSize, deleteSelfHostedFile, fileUploadPromiseToCdn, isSelfHostedFile, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';
import { MutationResolvers, Permission, QueryResolvers, UpdateUserSocialInput, UploadOperation } from '@src/generated/graphql-endpoint.types';
import { UserSocialFilter, UserSocialInsert } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { assertNoDuplicates } from '@src/shared/utils';
import { assertRequesterCanAddRoleCodes, daoInsertBatch, daoInsertRolesBatch, getRoleCodes, HttpError, isDefined, startEntityManagerTransaction, tryDeleteOldFileLinkFromEntity } from '@src/utils';
import { FileUpload, Upload } from 'graphql-upload';

export default {
  Mutation: {
    updateUser: async (parent, args, context: ApolloResolversContext, info) => {
      const unsecureEntityManager = context.unsecureEntityManager;
      const securityContext = context.securityContext;

      const error = await startEntityManagerTransaction(unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        if (!context.securityContext.userId)
          throw new HttpError(400, "Expected context.securityContext.userId!");

        if (!makePermsCalc()
            .withContext(securityContext)
            .withDomain({
              userId: [ args.input.id ]
            })
            .hasPermission(Permission.UpdateProfile)) {
          throw new HttpError(401, "Not authorized!");
        }

        const user = await unsecureEntityManager.user.findOne({
          filter: {
            id: args.input.id
          },
          projection: {
            id: true,
            avatarLink: true,
            bannerLink: true,
          }
        });
        if (!user) {
          throw new HttpError(401, "Invalid userId!");
        }

        if (isDefined(args.input.displayName)) {
          if (args.input.displayName === "")
            throw new HttpError(400, "displayName cannot be empty!");
        }

        if (isDefined(args.input.roles)) {
          const requesterRoleCodes = await getRoleCodes(transEntityManager.userRole, "userId", context.securityContext.userId);
          assertRequesterCanAddRoleCodes(requesterRoleCodes, args.input.roles);
          await daoInsertRolesBatch({
            dao: transEntityManager.userRole,
            roleCodes: args.input.roles,
            idKey: "userId",
            id: user.id
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
                  userId: user.id, 
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
              userId: user.id,
              platform: social.platform,
              username: social.username
            }),
            elementToRecord: (social: UpdateUserSocialInput): UserSocialInsert => ({
              ...social,
              userId: user.id
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
          id: user.id
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
      return true;
    },
    newUserRole: async (parent, args, context: ApolloResolversContext, info) => {
      context.entityManager.userRole.findOne({
        filter: 
      });

      return "";
    }
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };