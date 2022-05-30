import express from 'express';
import multer from 'multer';
import { RequestContext, RequestWithContext } from '@src/misc/context';
import { getOperationMetadataFromRequest } from '@src/controllers/entity-manager.controller';
import { deleteSelfHostedFile, isSelfHostedFile, relativeToSelfHostedFilePath, uniqueFileName } from '@src/controllers/cdn.controller';
import { HttpError } from '@src/utils/utils';
import { authAddSecurityContext } from '@src/controllers/auth.controller';
import { isPermissionDomainValidForOpDomain } from '@src/controllers/perms.controller';

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
      const entityManager = req.context.entityManager;
      const securityContext = req.context.securityContext;

      // Check permissions
      if (!metadata || metadata.userId.length == 0 || !isPermissionDomainValidForOpDomain(securityContext.MANAGE_USER_ROLES, {
        userId: [ metadata.userId[0] ]
      })) {
        throw new HttpError(401, "Not authorized!");
      }

      // Ensure userId is valid
      const user = await entityManager.user.findOne({
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
    if (!req.context || !req.context.securityContext || !req.context.user) {
      next(new HttpError(400, "Expected context, context.securityContext, and context.metadata."))
      return;
    }
    
    try {
      const user = req.context.user;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const entityManager = req.context.entityManager;
      
      const socialsUpdated = req.body.socials;
      const socials: {
        platform: string,
        username: string,
        link: string,
      }[] = JSON.parse(req.body.socials);
      if (socialsUpdated) {
        // Delete socials that aren't part of our new updated batch.
        const deletedSocials = await entityManager.userSocial.findAll({
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
        await entityManager.userSocial.deleteAll({
          filter: {
            id: { in: deletedSocials.map(x => x.id) }
          }
        })
        // Insert the new updated batch of socials
        for (const social of socials) {
          const foundSocial = await entityManager.userSocial.findOne({
            filter: {
              userId: user.id,
              platform: social.platform,
              username: social.username
            }
          });
          if (foundSocial) {
            await entityManager.userSocial.updateOne({
              filter: {
                userId: user.id,
                platform: social.platform,
                username: social.username
              },
              changes: foundSocial
            });
          } else {
            await entityManager.userSocial.insertOne({
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
      // TODO: Make avatar readonly, and let it only be set here. Otherwise users can 
      //       change their avatar to another users avatar, then change their avatar again
      //       to delete another user's avatar.
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

      await entityManager.user.updateOne({
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
          ...(socialsUpdated && { socials }),
          ...(req.body.displayName && { displayName: req.body.displayName }),
          ...(req.body.bio && { bio: req.body.bio }),
          ...(avatarUpdated && { avatarLink: avatarSelfHostedFilePath }),
          ...(bannerUpdated && { bannerLink: bannerSelfHostedFilePath }),
        }
      });
    } catch (err) {
      next(err)
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
