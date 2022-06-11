import { authAddSecurityContext } from '@src/controllers/auth.controller';
import { uniqueFileName } from '@src/controllers/cdn.controller';
import { getOperationMetadataFromRequest } from '@src/controllers/entity-manager.controller/entity-manager';
import { RoleCode } from '@src/generated/graphql-endpoint.types';
import { Permission } from '@src/generated/model.types';
import { ProjectMemberFilter, ProjectMemberInsert } from '@src/generated/typetta';
import { RequestContext, RequestWithContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security/permissions-calculator';
import { assertRequesterCanManageRoleCodes, daoInsertBatch, daoInsertRolesBatch, getRoleCodes, HttpError, startEntityManagerTransactionREST, tryDeleteOldFileLinkFromEntity } from '@src/utils';
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

//#region // ----- PROJECT ROUTE ----- //
type PostProjectContext = {
  project: {
    id: string,
    cardImageLink?: string | null,
    bannerLink?: string | null,
  }
};
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
          .hasPermission(Permission.UpdateProject)) {
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

    let response = {};
    const transSucceeded = await startEntityManagerTransactionREST(req, next, async (transEntityManager) => {
      const projectMembersUpdated = req.body.projectMembers;
      if (projectMembersUpdated) {
        type ProjectMemberEdit = {
          userId: string,
          contributions: string,
          roles: RoleCode[]
        }
        let projectMemberEdits: ProjectMemberEdit[] = [];
        projectMemberEdits = JSON.parse(req.body.projectMembers);
        
        // Get the requester's roles for this project if they
        // a project member object for this project. Note that
        // all the project members should be in this upload
        // requeust. Our upload requests are all or nothing.

        // Everything that is inside of the request will become
        // kept, and everything else is deleted.
        
        const requesterUserRoleCodes = await getRoleCodes(transEntityManager.userRole, "userId", userId);
        const requesterProjectMemberRoleCodes = projectMemberEdits.find(x => x.userId === userId)?.roles ?? [];
        const requesterRoleCodes = [...requesterUserRoleCodes, ...requesterProjectMemberRoleCodes];
        
        // Insert projectMembers
        await daoInsertBatch({
          dao: transEntityManager.projectMember,
          elements: projectMemberEdits,
          deleteFilter: <ProjectMemberFilter>{
            $and: [
              { 
                projectId: project.id, 
              },
              { 
                $nor: projectMemberEdits.map(x => ({ 
                  userId: x.userId
                }))
              }
            ]
          },
          // All new members must join through
          // the invite system
          create: false,
          elementToUpdateFilter: (member: ProjectMemberEdit): ProjectMemberFilter => ({
            userId: member.userId,
            projectId: project.id,
          }),
          elementToRecord: (member: ProjectMemberEdit): ProjectMemberInsert => ({
            userId: member.userId,
            contributions: member.contributions,
            projectId: project.id
          }),
          foreachSuccess: async (member: ProjectMemberEdit, memberId: string) => {
            assertRequesterCanManageRoleCodes(requesterRoleCodes, member.roles);

            // Insert roles for each member
            await daoInsertRolesBatch({
              dao: transEntityManager.projectMemberRole,
              roleCodes: member.roles,
              idKey: "projectMemberId",
              id: memberId
            });
          }
        });
      }

      const [cardImageUpdated, cardImageSelfHostedFilePath] = tryDeleteOldFileLinkFromEntity(req, "cardImage", project);

      const [bannerUpdated, bannerSelfHostedFilePath] = tryDeleteOldFileLinkFromEntity(req, "banner", project);

      const accessUpdated = req.body.access !== undefined;
      const nameUpdated = req.body.name !== undefined;
      const pitchUpdated = req.body.name !== undefined;
      const descriptionUpdated = req.body.name !== undefined;

      await transEntityManager.project.updateOne({
        filter: {
          id: project.id
        },
        changes: {
          ...(accessUpdated && { access: req.body.access }),
          ...(nameUpdated && { name: req.body.name }),
          ...(pitchUpdated && { pitch: req.body.pitch }),
          ...(descriptionUpdated && { description: req.body.description }),
          ...(cardImageUpdated && { cardImageLink: cardImageSelfHostedFilePath}),
          ...(bannerUpdated && { bannerLink: bannerSelfHostedFilePath}),
        }
      });

      // Query for the latest updated members
      let members;
      if (projectMembersUpdated) {
        const result = await transEntityManager.project.findOne({
          filter: {
            id: project.id
          },
          projection: {
            members: {
              id: true,
              user: {
                id: true,
                avatarLink: true,
                username: true,
                displayName: true,
              },
              contributions: true,
              roles: {
                roleCode: true,
              }
            }
          }
        });
        members = result?.members;
      }

      response = {
        message: "Project upload success!",
        data: {
          project: {
            ...(accessUpdated && { access: req.body.access }),
            ...(projectMembersUpdated && { members }),
            ...(nameUpdated && { name: req.body.name }),
            ...(pitchUpdated && { pitch: req.body.pitch }),
            ...(descriptionUpdated && { description: req.body.description }),
            ...(cardImageUpdated && { cardImageLink: cardImageSelfHostedFilePath }),
            ...(bannerUpdated && { bannerLink: bannerSelfHostedFilePath }),
          }
        }
      };
    });
    if (transSucceeded) {
      res.status(201).send(response);
    }
  }
);
//#endregion // -- PROJECT ROUTE ----- //

/**
TODO AFTER BASIC FUNC: Apollo can handle file uploads. See https://www.apollographql.com/docs/apollo-server/data/file-uploads/. We should use this instead of using dedicated rest APIs for creation. Using graphql's upload system also makes it easier for us to process the files, because we can control exactly what file goes where, and also halt saving the file if permissions fail, etc.
*/

export default router;
