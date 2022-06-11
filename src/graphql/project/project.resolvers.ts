import { MutationResolvers, Permission, QueryResolvers, RoleCode, UploadOperation } from '@src/generated/graphql-endpoint.types';
import { EntityManager } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { daoInsertRolesBatch, isDefined, startEntityManagerTransaction } from '@src/utils';
import { HttpError } from '@src/shared/utils';
import { DataSize, fileUploadPromiseToCdn, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';

export default {
  Mutation: {
    newProject: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext.userId)
        throw new HttpError(200, "Expected context.securityContext.userId.");
      
      // Check permissions
      if (!makePermsCalc()
          .withContext(context.securityContext)
          .hasPermission(Permission.CreateProject)) {
        throw new HttpError(401, "Not authorized!");
      }

      const userId = context.securityContext.userId;
      let newProjectId = "";
      
      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        const insertedProject = await transEntityManager.project.insertOne({
          record: {
            name: args.input.name,
            pitch: args.input.pitch,
            access: args.input.access,
            createdAt: Date.now()
          }
        });

        const projectOwner = await transEntityManager.projectMember.insertOne({
          record: {
            userId,
            projectId: insertedProject.id,
            createdAt: Date.now()
          }
        })

        await daoInsertRolesBatch({
          dao: transEntityManager.projectMemberRole, 
          roleCodes: [RoleCode.ProjectMember, RoleCode.ProjectOwner],
          idKey: "projectMemberId",
          id: projectOwner.id
        });

        newProjectId = insertedProject.id;
      });
      if (error)
        throw new HttpError(400, error.message);

      return newProjectId;
    },

    updateProject: async (parent, args, context: ApolloResolversContext, info) => {
      if (!makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({
            projectId: [ args.input.id ]
          })
          .hasPermission(Permission.UpdateProject)) {
        throw new HttpError(401, "Not authorized!");
      }

      const project = await context.unsecureEntityManager.project.findOne({
        filter: {
          id: args.input.id
        },
        projection: {
          cardImageLink: true,
          bannerLink: true,
        }
      });
      if (!project) {
        throw new HttpError(401, "Invalid projectid!");
      }
  
      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        let cardImageSelfHostedFilePath = "";
        if (isDefined(args.input.cardImage)) {
          if (args.input.cardImage.operation === UploadOperation.Insert ||
            args.input.cardImage.operation === UploadOperation.Delete)
            tryDeleteFileIfSelfHosted(project.cardImageLink);
          
          if (args.input.cardImage.operation === UploadOperation.Insert) {
            cardImageSelfHostedFilePath = await fileUploadPromiseToCdn({
              fileUploadPromise: args.input.cardImage.upload!,
              maxSizeBytes: 5 * DataSize.MB
            });
          }
        }

        let bannerSelfHostedFilePath = "";
        if (isDefined(args.input.banner)) {
          if (args.input.banner.operation === UploadOperation.Insert ||
            args.input.banner.operation === UploadOperation.Delete)
            tryDeleteFileIfSelfHosted(project.bannerLink);
          
          if (args.input.banner.operation === UploadOperation.Insert) {
            bannerSelfHostedFilePath = await fileUploadPromiseToCdn({
              fileUploadPromise: args.input.banner.upload!,
              maxSizeBytes: 10 * DataSize.MB
            });
          }
        }

        await transEntityManager.project.updateOne({
          filter: {
            id: args.input.id
          },
          changes: {
            ...(isDefined(args.input.access) && { access: args.input.access }),
            ...(isDefined(args.input.name) && { name: args.input.name }),
            ...(isDefined(args.input.pitch) && { pitch: args.input.pitch }),
            ...(isDefined(args.input.description) && { description: args.input.description }),
            ...(isDefined(args.input.galleryImageLinks) && { galleryImageLinks: args.input.galleryImageLinks }),
            ...(isDefined(args.input.soundcloudEmbedSrc) && { soundcloudEmbedSrc: args.input.soundcloudEmbedSrc }),
            ...(isDefined(args.input.downloadLinks) && { downloadLinks: args.input.downloadLinks }),
            ...(isDefined(args.input.cardImage) && { cardImageLink: cardImageSelfHostedFilePath}),
            ...(isDefined(args.input.banner) && { bannerLink: bannerSelfHostedFilePath}),
          }
        });
      });
      if (error) {
        throw error;
      }

      return true;
    }
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };

async function makeProjectMember(entityManager: EntityManager, userId: string, projectId: string) {
  const member = await entityManager.projectMember.insertOne({
    record: {
      userId: userId,
      projectId: projectId,
      createdAt: Date.now()
    }
  })
  await daoInsertRolesBatch({
    dao: entityManager.projectMemberRole, 
    roleCodes: [ RoleCode.ProjectMember ], 
    idKey: "projectMemberId", 
    id: member.projectId
  });
  return member;
}