import express from 'express';
import multer from 'multer';
import { RequestContext, RequestWithContext } from '@src/misc/context';
import { getOperationMetadataFromRequest } from '@src/controllers/entity-manager.controller/entity-manager';
import { deleteSelfHostedFile, isSelfHostedFile, relativeToSelfHostedFilePath, uniqueFileName } from '@src/controllers/cdn.controller';
import { HttpError } from '@src/utils';
import { authAddSecurityContext } from '@src/controllers/auth.controller';
import { getHighestRole, isRoleBelow, isRoleBelowOrEqual } from '@src/shared/security';
import { Permission } from '@src/generated/model.types';
import { RoleCode } from '@src/generated/graphql-endpoint.types';
import { makePermsCalc } from '@src/shared/security/permissions-calculator';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

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

type PostUserContext = {
  user: {
    id: string,
    avatarLink?: string | null,
    bannerLink?: string | null,
  }
}

router.post(
  '/user', 
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
  // Return file paths
  async function(req: RequestWithContext<RequestContext & PostUserContext>, res, next) {
    if (!req.context || !req.context.securityContext || !req.context.securityContext.userId || !req.context.user) {
      next(new HttpError(400, "Expected context, context.securityContext, context.securityContext.userId, and context.metadata."))
      return;
    }
    
    const userId = req.context.securityContext.userId;
    const user = req.context.user;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
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
      async (transactionEntityManager) => {
        const rolesUpdated = req.body.roles;
        let roleCodes: RoleCode[] = [];
        if (rolesUpdated) {
          roleCodes = JSON.parse(req.body.roles);
          // Ensure the roles are all below the current user's max role
          const requesterRoleCodes = (await transactionEntityManager.userRole.findAll({
            filter: {
              // We filter against the userId of the user
              // that's requesting this change.
              userId
            },
            projection: {
              roleCode: true
            }
          })).map(x => x.roleCode);
          const requestHighestRoleCode = getHighestRole(requesterRoleCodes);
          for (const roleCode of requesterRoleCodes) {
            if (!isRoleBelowOrEqual(roleCode, requestHighestRoleCode)) {
              throw new HttpError(403, "Cannot only add roles below your current role!");
            }
          }
          // Delete roles that aren't part of our new updated batch.
          const deletedRoles = await transactionEntityManager.userRole.findAll({
            filter: {
              $and: [
                { 
                  userId: user.id, 
                },
                { 
                  $nor: roleCodes.map(x => ({ 
                    roleCode: x
                  }))
                }
              ]
            },
            projection: {
              id: true
            }
          });
          await transactionEntityManager.userRole.deleteAll({
            filter: {
              id: { in: deletedRoles.map(x => x.id) }
            }
          })
          // Insert the new updated batch of roles
          for (const roleCode of roleCodes) {
            const foundRole = await transactionEntityManager.userRole.findOne({
              filter: {
                userId: user.id,
                roleCode
              }
            });
            if (!foundRole) {
              // Only insert new role when it doesn't exist
              // There's no need to update roles because userRoles
              // only contain a roleCode.
              await transactionEntityManager.userRole.insertOne({
                record: {
                  roleCode,
                  userId: user.id
                }
              });
            }
          }
        }

        const socialsUpdated = req.body.socials;
        let socials: {
          platform: string,
          username: string,
          link: string,
        }[] = [];
        if (socialsUpdated) {
          socials = JSON.parse(req.body.socials);
          // Delete socials that aren't part of our new updated batch.
          const deletedSocials = await transactionEntityManager.userSocial.findAll({
            filter: {
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
            projection: {
              id: true
            }
          });
          await transactionEntityManager.userSocial.deleteAll({
            filter: {
              id: { in: deletedSocials.map(x => x.id) }
            }
          })
          // Insert the new updated batch of socials
          for (const social of socials) {
            const foundSocial = await transactionEntityManager.userSocial.findOne({
              filter: {
                userId: user.id,
                platform: social.platform,
                username: social.username
              }
            });
            if (foundSocial) {
              await transactionEntityManager.userSocial.updateOne({
                filter: {
                  userId: user.id,
                  platform: social.platform,
                  username: social.username
                },
                changes: foundSocial
              });
            } else {
              await transactionEntityManager.userSocial.insertOne({
                record: {
                  ...social,
                  userId: user.id
                }
              });
            }
          }
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

        await transactionEntityManager.user.updateOne({
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
      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction();
      next(err)
    } finally {
      await session.endSession();
    }
  }
);

// router.post('/project', upload.array('screenshots', 10), function(req, res, next) {
//   const user = await context.entityManager.user.findOne({
//     filter: {
//       id: args.userId
//     },
//     projection: {
//       avatarLink: true
//     }
//   });

//   if (!user) {
//     return "";
//   }

//   // User exists
//   if (user.avatarLink && isSelfHostedFile(user.avatarLink)) {
//     deleteSelfHostedFile(user.avatarLink);
//   }
//   return "";
// });

export default router;
