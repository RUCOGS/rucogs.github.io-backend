import {
  DataSize,
  fileUploadPromiseToCdn,
  isSelfHostedFile,
  tryDeleteFileIfSelfHosted,
} from '@src/controllers/cdn.controller';
import { regenerateSecurityContext } from '@src/controllers/security.controller';
import {
  MutationResolvers,
  Permission,
  QueryResolvers,
  RoleCode,
  SubscriptionResolvers,
  UploadOperation,
} from '@src/generated/graphql-endpoint.types';
import {
  EntityManager,
  ProjectDAO,
  ProjectFilter,
  ProjectInsert,
  ProjectPlainModel,
  ProjectUpdate,
} from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { FuncQueue, isDefined, startEntityManagerTransaction, startEntityManagerTransactionGraphQL } from '@src/utils';
import AsyncLock from 'async-lock';
import { deleteAllProjectInvites } from '../project-invite/project-invite.resolvers';
import { deleteAllProjectMembers, makeProjectMember } from '../project-member/project-member.resolvers';

const updateProjectLock = new AsyncLock();

export default {
  Query: {
    projectCount: async (parent, args, context: ApolloResolversContext, info) => {
      return context.unsecureEntityManager.project.count();
    },
  },
  Mutation: {
    newProject: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext.userId) throw new HttpError(200, 'Expected context.securityContext.userId.');

      makePermsCalc().withContext(context.securityContext).assertPermission(Permission.CreateProject);

      const userId = context.securityContext.userId;

      let project: ProjectPlainModel | undefined;
      const error = await startEntityManagerTransactionGraphQL(
        context,
        async (transEntityManager, postTransFuncQueue) => {
          project = await makeProject({
            entityManager: transEntityManager,
            record: {
              name: args.input.name,
              pitch: args.input.pitch,
              access: args.input.access,
            },
            subFuncQueue: postTransFuncQueue,
            ownerUserId: userId,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);
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

        const error = await startEntityManagerTransactionGraphQL(
          context,
          async (transEntityManager, postTransFuncQueue) => {
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

            await updateProject({
              entityManager: transEntityManager,
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
              subFuncQueue: postTransFuncQueue,
            });
          },
        );
        if (error instanceof Error) throw new HttpError(400, error.message);
      });
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

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteProject({
            entityManager: transEntityManager,
            filter: { id: args.id },
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);
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
        async (transEntityManager, postTransFuncQueue) => {
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

          pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectMemberUpdated, member, postTransFuncQueue);
          pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectMemberUpdated, currentOwner, postTransFuncQueue);
        },
      );
      if (error) throw new HttpError(400, error.message);
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

export async function makeProject(options: {
  entityManager: EntityManager;
  record: ProjectInsert;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
  ownerUserId: string;
}) {
  const { entityManager, record, emitSubscription = true, subFuncQueue, ownerUserId } = options;
  const project = await entityManager.project.insertOne({
    record,
  });

  if (ownerUserId) {
    await makeProjectMember({
      entityManager,
      record: {
        userId: ownerUserId,
        projectId: project.id,
      },
      additionalRoles: [RoleCode.ProjectOwner],
      subFuncQueue,
    });
  }

  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectCreated, project, subFuncQueue);
  return project;
}

export async function updateProject(options: {
  entityManager: EntityManager;
  filter: ProjectFilter;
  changes: ProjectUpdate;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, changes, emitSubscription = true, subFuncQueue } = options;
  await entityManager.project.updateOne({ filter, changes });
  const updatedProject = await entityManager.project.findOne({ filter });
  if (!updatedProject) throw new HttpError(400, 'Expected Project to not be null during update!');
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectUpdated, updatedProject, subFuncQueue);
}

export async function deleteProject(options: {
  entityManager: EntityManager;
  filter: ProjectFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const project = await entityManager.project.findOne({ filter });
  if (!project) throw new HttpError(400, 'Expected Project to not be null during delete!');

  await deleteAllProjectMembers({
    entityManager,
    filter: { projectId: project.id },
    subFuncQueue,
  });

  await deleteAllProjectInvites({
    entityManager,
    filter: { projectId: project.id },
    subFuncQueue,
  });

  tryDeleteFileIfSelfHosted(project.cardImageLink);
  tryDeleteFileIfSelfHosted(project.bannerLink);
  if (project.galleryImageLinks)
    for (const galleryImaageLink of project.galleryImageLinks) tryDeleteFileIfSelfHosted(galleryImaageLink);

  await entityManager.project.deleteOne({
    filter: { id: project.id },
  });

  await entityManager.project.deleteOne({ filter });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectDeleted, project, subFuncQueue);
}

export async function regenerateProjectMemberSecurityContexts(options: {
  entityManager: EntityManager;
  filter: ProjectFilter;
}) {
  const { entityManager, filter } = options;
  const project = await entityManager.project.findOne({
    filter,
    projection: { members: { userId: true } },
  });
  if (project) {
    for (const member of project.members) await regenerateSecurityContext(entityManager, member.userId);
  }
}
