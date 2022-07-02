import {
  DataSize,
  fileUploadPromiseToCdn,
  isSelfHostedFile,
  tryDeleteFileIfSelfHosted,
} from '@src/controllers/cdn.controller';
import {
  MutationResolvers,
  Permission,
  QueryResolvers,
  RoleCode,
  SubscriptionResolvers,
  UploadOperation,
} from '@src/generated/graphql-endpoint.types';
import { ProjectDAO, ProjectPlainModel } from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { daoInsertRolesBatch, isDefined, startEntityManagerTransaction } from '@src/utils';
import AsyncLock from 'async-lock';
import { deleteProjectInvites, makeProjectMember } from '../project-invite/project-invite.resolvers';
import { deleteProjectMembers } from '../project-member/project-member.resolvers';

const updateProjectLock = new AsyncLock();

export default {
  Mutation: {
    newProject: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext.userId) throw new HttpError(200, 'Expected context.securityContext.userId.');

      makePermsCalc().withContext(context.securityContext).assertPermission(Permission.CreateProject);

      const userId = context.securityContext.userId;

      let project: ProjectPlainModel | undefined;
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          project = await transEntityManager.project.insertOne({
            record: {
              name: args.input.name,
              pitch: args.input.pitch,
              access: args.input.access,
            },
          });

          const projectOwner = await makeProjectMember(
            transEntityManager,
            {
              userId,
              projectId: project.id,
            },
            [RoleCode.ProjectOwner],
          );

          await daoInsertRolesBatch({
            dao: transEntityManager.projectMemberRole,
            roleCodes: [RoleCode.ProjectMember, RoleCode.ProjectOwner],
            idKey: 'projectMemberId',
            id: projectOwner.id,
          });
        },
      );
      if (error) throw new HttpError(400, error.message);

      pubsub.publish(PubSubEvents.ProjectCreated, project);
      return project?.id;
    },

    updateProject: async (parent, args, context: ApolloResolversContext, info) => {
      await updateProjectLock.acquire('lock', async () => {
        const permsCalc = makePermsCalc().withContext(context.securityContext);
        permsCalc
          .withDomain({
            projectId: args.input.id,
          })
          .assertPermission(Permission.UpdateProject);
        if (isDefined(args.input.createdAt) || isDefined(args.input.completedAt)) {
          permsCalc.assertPermission(Permission.ManageMetadata);
        }

        const project = await context.unsecureEntityManager.project.findOne({
          filter: { id: args.input.id },
          projection: {
            cardImageLink: true,
            bannerLink: true,
            galleryImageLinks: true,
          },
        });
        if (!project) {
          throw new HttpError(401, 'Invalid projectid!');
        }

        const error = await startEntityManagerTransaction(
          context.unsecureEntityManager,
          context.mongoClient,
          async (transEntityManager) => {
            let cardImageSelfHostedFilePath = null;
            if (isDefined(args.input.cardImage)) {
              if (
                args.input.cardImage.operation === UploadOperation.Insert ||
                args.input.cardImage.operation === UploadOperation.Delete
              )
                tryDeleteFileIfSelfHosted(project.cardImageLink);

              if (args.input.cardImage.operation === UploadOperation.Insert) {
                cardImageSelfHostedFilePath = await fileUploadPromiseToCdn({
                  fileUploadPromise: args.input.cardImage.upload!,
                  maxSizeBytes: 5 * DataSize.MB,
                });
              }
            }

            let bannerSelfHostedFilePath = null;
            if (isDefined(args.input.banner)) {
              if (
                args.input.banner.operation === UploadOperation.Insert ||
                args.input.banner.operation === UploadOperation.Delete
              )
                tryDeleteFileIfSelfHosted(project.bannerLink);

              if (args.input.banner.operation === UploadOperation.Insert) {
                bannerSelfHostedFilePath = await fileUploadPromiseToCdn({
                  fileUploadPromise: args.input.banner.upload!,
                  maxSizeBytes: 10 * DataSize.MB,
                });
              }
            }

            let galleryImageLinks: string[] = [];
            if (isDefined(args.input.galleryImages)) {
              // Delete files that weren't found in the new galleryImages but existed in the old galleryImages
              if (project.galleryImageLinks) {
                for (const oldLink of project.galleryImageLinks) {
                  if (!args.input.galleryImages.some((x) => x.source === oldLink)) {
                    // Delete this
                    if (isSelfHostedFile(oldLink)) tryDeleteFileIfSelfHosted(oldLink);
                  }
                }
              }

              // Upload the new files, and build the list of links to those files
              for (const image of args.input.galleryImages) {
                let relativePath = image.source ?? '';
                if (image.upload) {
                  relativePath = await fileUploadPromiseToCdn({
                    fileUploadPromise: image.upload,
                    maxSizeBytes: 10 * DataSize.MB,
                  });
                }
                galleryImageLinks.push(relativePath);
              }
            }

            await transEntityManager.project.updateOne({
              filter: {
                id: args.input.id,
              },
              changes: {
                ...(isDefined(args.input.completed) && {
                  completedAt: args.input.completed ? Date.now() : null,
                }),
                ...(isDefined(args.input.completedAt) && {
                  completedAt: args.input.completedAt,
                }),
                ...(isDefined(args.input.createdAt) && {
                  createdAt: args.input.createdAt,
                }),
                ...(isDefined(args.input.tags) && { tags: args.input.tags }),
                ...(isDefined(args.input.access) && {
                  access: args.input.access,
                }),
                ...(isDefined(args.input.name) && { name: args.input.name }),
                ...(isDefined(args.input.pitch) && { pitch: args.input.pitch }),
                ...(isDefined(args.input.description) && {
                  description: args.input.description,
                }),
                ...(isDefined(args.input.galleryImages) && { galleryImageLinks }),
                ...(isDefined(args.input.soundcloudEmbedSrc) && {
                  soundcloudEmbedSrc: args.input.soundcloudEmbedSrc,
                }),
                ...(isDefined(args.input.downloadLinks) && {
                  downloadLinks: args.input.downloadLinks,
                }),
                ...(isDefined(args.input.cardImage) && {
                  cardImageLink: cardImageSelfHostedFilePath,
                }),
                ...(isDefined(args.input.banner) && {
                  bannerLink: bannerSelfHostedFilePath,
                }),
              },
            });
          },
        );
        if (error) {
          throw error;
        }
      });

      const updatedProject = await context.unsecureEntityManager.project.findOne({
        filter: { id: args.input.id },
      });
      pubsub.publish(PubSubEvents.ProjectUpdated, updatedProject);
      return true;
    },

    deleteProject: async (parent, args, context: ApolloResolversContext, info) => {
      if (
        !makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({
            projectId: args.id,
          })
          .hasPermission(Permission.DeleteProject)
      ) {
        throw new HttpError(401, 'Not authorized!');
      }

      const project = await context.unsecureEntityManager.project.findOne({
        filter: { id: args.id },
        projection: ProjectDAO.projection({
          id: true,
          cardImageLink: true,
          bannerLink: true,
          galleryImageLinks: true,
          members: {
            id: true,
          },
          discordConfig: {
            id: true,
          },
        }),
      });
      if (!project) throw new HttpError(400, "Project doesn't exist!");

      if (project.discordConfig) throw new HttpError(400, 'Cannot delete project with Discord presence!');

      const invites = await context.unsecureEntityManager.projectInvite.findAll({
        filter: { projectId: args.id },
      });

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          await deleteProjectMembers(transEntityManager, {
            projectId: args.id,
          });

          await deleteProjectInvites(
            transEntityManager,
            {
              projectId: args.id,
            },
            true,
          );

          tryDeleteFileIfSelfHosted(project.cardImageLink);
          tryDeleteFileIfSelfHosted(project.bannerLink);
          if (project.galleryImageLinks) {
            for (const galleryImaageLink of project.galleryImageLinks) tryDeleteFileIfSelfHosted(galleryImaageLink);
          }

          await transEntityManager.project.deleteOne({
            filter: { id: args.id },
          });
        },
      );

      if (error) {
        throw error;
      }

      for (const invite of invites) pubsub.publish(PubSubEvents.ProjectInviteDeleted, invite);
      pubsub.publish(PubSubEvents.ProjectDeleted, project);
      return true;
    },

    transferProjectOwnership: async (parent, args, context: ApolloResolversContext, info) => {
      if (
        !makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({
            projectId: args.projectId,
          })
          .hasPermission(Permission.TransferProjectOwnership)
      ) {
        throw new HttpError(401, 'Not authorized!');
      }

      const project = await context.unsecureEntityManager.project.findOne({
        filter: {
          id: args.projectId,
        },
        projection: {
          members: {
            id: true,
            roles: {
              id: true,
              roleCode: true,
            },
          },
        },
      });
      if (!project) throw new HttpError(400, "Project doesn't exist!");

      const member = project.members.find((x) => x.id === args.memberId);
      if (!member) throw new HttpError(400, "Member isn't a part of this project!");

      const currentOwner = project.members.find((x) => x.roles.some((x) => x.roleCode === RoleCode.ProjectOwner));
      if (!currentOwner) throw new HttpError(200, "Project doesn't have an owner!");

      if (currentOwner.id === member.id) throw new HttpError(400, 'Cannot transfer ownership to the owner!');

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          await transEntityManager.projectMemberRole.deleteOne({
            filter: {
              projectMemberId: currentOwner.id,
              roleCode: RoleCode.ProjectOwner,
            },
          });

          await transEntityManager.projectMemberRole.insertOne({
            record: {
              projectMemberId: member.id,
              roleCode: RoleCode.ProjectOwner,
            },
          });
        },
      );

      if (error) {
        throw error;
      }

      pubsub.publish(PubSubEvents.ProjectMemberUpdated, member);
      pubsub.publish(PubSubEvents.ProjectMemberUpdated, currentOwner);
      return true;
    },
  },
  Subscription: {
    projectCreated: makeSubscriptionResolver().pubsub(PubSubEvents.ProjectCreated).shallowOneToOneFilter().build(),

    projectUpdated: makeSubscriptionResolver().pubsub(PubSubEvents.ProjectUpdated).shallowOneToOneFilter().build(),

    projectDeleted: makeSubscriptionResolver().pubsub(PubSubEvents.ProjectDeleted).shallowOneToOneFilter().build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};
