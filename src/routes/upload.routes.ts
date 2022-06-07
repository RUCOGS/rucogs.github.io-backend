import { authAddSecurityContext } from '@src/controllers/auth.controller';
import { deleteSelfHostedFile, isSelfHostedFile, relativeToSelfHostedFilePath, uniqueFileName } from '@src/controllers/cdn.controller';
import { getOperationMetadataFromRequest } from '@src/controllers/entity-manager.controller/entity-manager';
import { RoleCode } from '@src/generated/graphql-endpoint.types';
import { Permission } from '@src/generated/model.types';
import { EntityManager, ProjectMemberFilter, ProjectMemberInsert, UserSocialFilter, UserSocialInsert } from '@src/generated/typetta';
import { RequestContext, RequestWithContext } from '@src/misc/context';
import { getHighestRole, isRoleBelowOrEqual } from '@src/shared/security';
import { makePermsCalc } from '@src/shared/security/permissions-calculator';
import { HttpError } from '@src/utils';
import { AbstractDAO } from '@twinlogix/typetta';
import express from 'express';
import multer from 'multer';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

//#region // ----- MULTER ----- //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, uniqueFileName(file.originalname));
  }
});
const upload = multer({
  storage
});
//#endregion // -- MULTER ----- //

//#region // ----- USER ROUTE ----- //
type PostUserContext = {
  user: {
    id: string,
    avatarLink?: string | null,
    bannerLink?: string | null,
  }
}
router.post('/user', 
  // Authenticate and add security context
  authAddSecurityContext,
  async function(req: RequestWithContext<RequestContext & PostUserContext>, res, next) {
    if (!req.context || !req.context.securityContext) {
      next(new HttpError(400, "Expected context and context.securityContext."))
      return;
    }

    try {
      const metadata: {
        userId: string[]
      } = getOperationMetadataFromRequest(req);
      const unsecureEntityManager = req.context.unsecureEntityManager;
      const securityContext = req.context.securityContext;

      // Check permissions
      if (!metadata || metadata.userId.length == 0 || 
        !makePermsCalc()
          .withContext(securityContext)
          .withDomain({
            userId: [ metadata.userId[0] ]
          })
          .hasPermission(Permission.ManageUserRoles)) {
        throw new HttpError(401, "Not authorized!");
      }

      // Ensure userId is valid
      const user = await unsecureEntityManager.user.findOne({
        filter: {
          id: metadata.userId[0]
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

      req.context.user = user;
      next();
    } catch (err) {
      next(err);
    }
  },
  // Upload files
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1
    }, 
    {
      name: 'banner',
      maxCount: 1
    }
  ]), 
  // Process rest of request
  async function(req: RequestWithContext<RequestContext & PostUserContext>, res, next) {
    if (!req.context || !req.context.securityContext || !req.context.securityContext.userId || !req.context.user) {
      next(new HttpError(400, "Expected context, context.securityContext, context.securityContext.userId, and context.metadata."))
      return;
    }
    
    const userId = req.context.securityContext.userId;
    const user = req.context.user;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    await startEntityManagerTransaction(req, next, async (transEntityManager) => {
      const rolesUpdated = req.body.roles;
      let roleCodes: RoleCode[] = [];
      if (rolesUpdated) {
        roleCodes = JSON.parse(req.body.roles);
        // Ensure the roles are all below the current user's max role
        const requesterRoleCodes = await getRoleCodes(transEntityManager.userRole, "userId", userId);
        assertRequesterCanAddRoleCodes(requesterRoleCodes, roleCodes);
        await daoInsertRolesBatch({
          dao: transEntityManager.userRole,
          roleCodes: roleCodes,
          idKey: "userId",
          id: user.id
        });
      }

      const socialsUpdated = req.body.socials;
      type UserSocialEdit = {
        platform: string,
        username: string,
        link: string,
      };
      let socials: UserSocialEdit[] = [];
      if (socialsUpdated) {
        socials = JSON.parse(req.body.socials);
        await daoInsertBatch({
          dao: transEntityManager.userSocial,
          elements: socials,
          deleteFilter: {
            $and: [
              { 
                userId: user.id, 
              },
              { 
                $nor: socials.map(x => ({ 
                  username: x.username, 
                  platform: x.platform,
                }))
              }
            ]
          },
          elementToUpdateFilter: (social: UserSocialEdit): UserSocialFilter => ({
            userId: user.id,
            platform: social.platform,
            username: social.username
          }),
          elementToRecord: (social: UserSocialEdit): UserSocialInsert => ({
            ...social,
            userId: user.id
          })
        });
      }

      const avatarUpdated = files['avatar'] && files['avatar'].length == 1;
      const avatarSelfHostedFilePath = avatarUpdated ? relativeToSelfHostedFilePath(files['avatar'][0].path) : "";
      // Purge old avatar if it's self hosted
      if (avatarUpdated && user.avatarLink 
        && isSelfHostedFile(user.avatarLink)) {
        deleteSelfHostedFile(user.avatarLink);
      }

      const bannerUpdated = files['banner'] && files['banner'].length == 1;
      const bannerSelfHostedFilePath = bannerUpdated ? relativeToSelfHostedFilePath(files['banner'][0].path) : "";
      // Purge old banner if it's self hosted
      if (bannerUpdated && user.bannerLink 
        && isSelfHostedFile(user.bannerLink)) {
        deleteSelfHostedFile(user.bannerLink);
      }

      await transEntityManager.user.updateOne({
        filter: {
          id: user.id
        },
        changes: {
          ...(req.body.displayName && { displayName: req.body.displayName }),
          ...(req.body.bio && { bio: req.body.bio }),
          ...(avatarUpdated && { avatarLink: avatarSelfHostedFilePath}),
          ...(bannerUpdated && { bannerLink: bannerSelfHostedFilePath}),
        }
      })

      res.status(201).send({
        message: "User upload success!",
        data: {
          ...(rolesUpdated && { roleCodes }),
          ...(socialsUpdated && { socials }),
          ...(req.body.displayName && { displayName: req.body.displayName }),
          ...(req.body.bio && { bio: req.body.bio }),
          ...(avatarUpdated && { avatarLink: avatarSelfHostedFilePath }),
          ...(bannerUpdated && { bannerLink: bannerSelfHostedFilePath }),
        }
      });
    });
  }
);
//#endregion // -- USER ROUTE ----- //

//#region // ----- PROJECT ROUTE ----- //
type PostProjectContext = {
  project: {
    id: string,
    cardImageLink?: string | null,
    bannerLink?: string | null,
  }
}
router.post('/project', 
  // Authenticate and add security context
  authAddSecurityContext,
  async function(req: RequestWithContext<RequestContext & PostProjectContext>, res, next) {
    if (!req.context || !req.context.securityContext) {
      next(new HttpError(400, "Expected context and context.securityContext."))
      return;
    }

    try {
      const metadata: {
        projectId: string[]
      } = getOperationMetadataFromRequest(req);
      const unsecureEntityManager = req.context.unsecureEntityManager;
      const securityContext = req.context.securityContext;

      // Check permissions
      if (!metadata || metadata.projectId.length == 0 || 
        !makePermsCalc()
          .withContext(securityContext)
          .withDomain({
            projectId: [ metadata.projectId[0] ]
          })
          .hasPermission(Permission.ManageProjectMemberRoles)) {
        throw new HttpError(401, "Not authorized!");
      }

      // Ensure projectId is valid
      const project = await unsecureEntityManager.project.findOne({
        filter: {
          id: metadata.projectId[0]
        },
        projection: {
          id: true,
          cardImageLink: true,
          bannerLink: true,
        }
      });
      if (!project) {
        throw new HttpError(401, "Invalid projectid!");
      }

      req.context.project = project;
      next();
    } catch (err) {
      next(err);
    }
  },
  // Upload files
  upload.fields([
    {
      name: 'cardImage',
      maxCount: 1
    }, 
    {
      name: 'banner',
      maxCount: 1
    }
  ]), 
  // Process rest of request
  async function(req: RequestWithContext<RequestContext & PostProjectContext>, res, next) {
    if (!req.context || !req.context.securityContext || !req.context.securityContext.userId || !req.context.project) {
      next(new HttpError(400, "Expected context, context.securityContext, context.securityContext.userId, and context.metadata."))
      return;
    }
    
    const userId = req.context.securityContext.userId;
    const project = req.context.project;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    await startEntityManagerTransaction(req, next, async (transEntityManager) => {
      const projectMembersUpdated = req.body.projectMembers;
      type ProjectMemberEdit = {
        userId: string,
        contributions: string,
        roles: RoleCode[]
      }
      let projectMembers: ProjectMemberEdit[] = [];
      if (projectMembersUpdated) {
        projectMembers = JSON.parse(req.body.projectMembers);
        
        // Get the requester's roles for this project if they
        // a project member object for this project. Note that
        // all the project members should be in this upload
        // requeust. Our upload requests are all or nothing.

        // Everything that is inside of the request will become
        // kept, and everything else is deleted.
        
        const requesterUserRoleCodes = await getRoleCodes(transEntityManager.userRole, "userId", userId);
        const requesterProjectMemberRoleCodes = projectMembers.find(x => x.userId === userId)?.roles ?? [];
        const requesterRoleCodes = [...requesterUserRoleCodes, ...requesterProjectMemberRoleCodes];
        
        // Insert projectMembers
        await daoInsertBatch({
          dao: transEntityManager.projectMember,
          elements: projectMembers,
          // Delete Filter
          deleteFilter: <ProjectMemberFilter>{
            $and: [
              { 
                projectId: project.id, 
              },
              { 
                $nor: projectMembers.map(x => ({ 
                  userId: x.userId
                }))
              }
            ]
          },
          elementToUpdateFilter: (member: ProjectMemberEdit): ProjectMemberFilter => ({
            userId: member.userId,
            projectId: project.id,
          }),
          elementToRecord: (member: ProjectMemberEdit): ProjectMemberInsert => ({
            userId: member.userId,
            contributions: member.contributions,
            projectId: project.id
          }),
          foreach: async (member: ProjectMemberEdit, memberId: string) => {
            assertRequesterCanAddRoleCodes(requesterRoleCodes, member.roles);

            // Insert roles for each member
            await daoInsertRolesBatch({
              dao: transEntityManager.projectMemberRole,
              roleCodes: member.roles,
              idKey: "projectMemberId",
              id: memberId
            })
          }
        });
      }

      const cardImageUpdated = files['cardImage'] && files['cardImage'].length == 1;
      const cardImageSelfHostedFilePath = cardImageUpdated ? relativeToSelfHostedFilePath(files['cardImage'][0].path) : "";
      // Purge old card image if it's self hosted
      if (cardImageUpdated && project.cardImageLink 
        && isSelfHostedFile(project.cardImageLink)) {
        deleteSelfHostedFile(project.cardImageLink);
      }

      const bannerUpdated = files['banner'] && files['banner'].length == 1;
      const bannerSelfHostedFilePath = bannerUpdated ? relativeToSelfHostedFilePath(files['banner'][0].path) : "";
      // Purge old banner if it's self hosted
      if (bannerUpdated && project.bannerLink 
        && isSelfHostedFile(project.bannerLink)) {
        deleteSelfHostedFile(project.bannerLink);
      }

      await transEntityManager.project.updateOne({
        filter: {
          id: project.id
        },
        changes: {
          ...(req.body.name && { displayName: req.body.name }),
          ...(req.body.pitch && { pitch: req.body.pitch }),
          ...(req.body.description && { description: req.body.description }),
          ...(cardImageUpdated && { cardImageLink: cardImageSelfHostedFilePath}),
          ...(bannerUpdated && { bannerLink: bannerSelfHostedFilePath}),
        }
      });

      res.status(201).send({
        message: "Project upload success!",
        data: {
          ...(projectMembersUpdated && { projectMembers: projectMembers }),
          ...(req.body.name && { displayName: req.body.name }),
          ...(req.body.pitch && { pitch: req.body.pitch }),
          ...(req.body.description && { description: req.body.description }),
          ...(cardImageUpdated && { cardImageLink: cardImageSelfHostedFilePath }),
          ...(bannerUpdated && { bannerLink: bannerSelfHostedFilePath }),
        }
      });
    });
  }
);
//#endregion // -- PROJECT ROUTE ----- //

//#region // ----- UPLOAD HELPERS ----- //

export async function getRoleCodes(roleDao: AbstractDAO<any>, idKey: string, id: string): Promise<RoleCode[]> {
  return (await roleDao.findAll({
    filter: {
      // We filter against the userId of the user
      // that's requesting this change.
      [idKey]: id
    },
    projection: {
      roleCode: true
    }
  })).map(x => x.roleCode as RoleCode)
}

export async function startEntityManagerTransaction(
  req: RequestWithContext<RequestContext>, 
  next: express.NextFunction, 
  fn: (transactionEntityManager: EntityManager & {
    __transaction_enabled__: true;
  }) => Promise<void>
) {
  if (!req.context || !req.context.securityContext || !req.context.securityContext.userId) {
    next(new HttpError(400, "Expected context, context.securityContext, context.securityContext.userId, and context.metadata."))
    return;
  }

  const entityManager = req.context.unsecureEntityManager;
  const mongoClient = req.context.mongoClient;
  
  const session = mongoClient.startSession()
  session.startTransaction({
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  })

  try {
    await entityManager.transaction({
        mongodb: { default: session }
      },
      fn
    );
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    await session.endSession();
  }
}

export async function daoInsertBatch(options: {
  dao: AbstractDAO<any>, 
  elements: any[], 
  deleteFilter: any, 
  elementToUpdateFilter: (element: any) => any, 
  elementToRecord: (element: any) => any,
  foreach?: (element: any, entityId: any) => Promise<void>;
}) {
  // Delete socials that aren't part of our new updated batch.
  const deletedEntities = await options.dao.findAll({
    filter: options.deleteFilter,
    projection: {
      id: true
    }
  });
  await options.dao.deleteAll({
    filter: {
      id: { in: deletedEntities.map(x => x.id) }
    }
  })
  // Insert the new updated batch of elements
  for (const element of options.elements) {
    const updateFilter = options.elementToUpdateFilter(element);
    let foundEntity = await options.dao.findOne({
      filter: updateFilter,
      projection: {
        id: true
      }
    });
    if (foundEntity) {
      await options.dao.updateOne({
        filter: updateFilter,
        changes: foundEntity,
      });
    } else {
      foundEntity = await options.dao.insertOne({
        record: options.elementToRecord(element)
      });
    }
    
    if (options.foreach)
      await options.foreach(element, foundEntity.id);
  }
}

export async function daoInsertRolesBatch(options: {
  dao: AbstractDAO<any>, 
  roleCodes: RoleCode[],
  idKey: string 
  id: string
}) {
  await daoInsertBatch({
    dao: options.dao,
    elements: options.roleCodes,
    // Delete Filter
    deleteFilter: {
      $and: [
        { 
          [options.idKey]: options.id, 
        },
        { 
          $nor: options.roleCodes.map(x => ({ 
            roleCode: x
          }))
        }
      ]
    },
    // Update Filter
    elementToUpdateFilter: (roleCode: RoleCode) => ( {
      [options.idKey]: options.id,
      roleCode
    }),
    // Record
    elementToRecord: (roleCode: RoleCode) => ({
      [options.idKey]: options.id,
      roleCode,
    })
  });
}

export function assertRequesterCanAddRoleCodes(requesterRoleCodes: RoleCode[], roleCodes: RoleCode[]) {
  const requestHighestRoleCode = getHighestRole(requesterRoleCodes);
  for (const roleCode of roleCodes) {
    if (!isRoleBelowOrEqual(roleCode, requestHighestRoleCode)) {
      throw new HttpError(403, "Cannot only add roles below your current role!");
    }
  }
}

//#endregion // -- UPLOAD HELPERS ----- //

export default router;
