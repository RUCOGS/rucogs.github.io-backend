import express from 'express';
import * as authController from '@src/controllers/auth.controller';
import AuthConfig from '@src/config/auth.config.json';
import passport from 'passport';
import multer from 'multer';
import path from 'path';
import { RequestContext, RequestWithContext, RequestWithDefaultContext } from '@src/context';
import { getOperationMetadataFromRequest } from '@src/controllers/entity-manager.controller';
import { deleteSelfHostedFile, isSelfHostedFile, relativeToSelfHostedFilePath } from '@src/controllers/file-upload.controller';

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
    cb(null, Date.now() + path.extname(file.originalname));
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
  authController.authAddSecurityContext,
  async function(req: RequestWithContext<RequestContext & PostUserContext>, res, next) {
    if (!req.context || !req.context.securityContext) {
      next(new Error("Expected context and context.securityContext."))
      return;
    }

    try {
      const metadata: {
        userId: string
      } = getOperationMetadataFromRequest(req);
      const entityManager = req.context.entityManager;
      const securityContext = req.context.securityContext;

      // Check permissions
      if (!authController.isPermissionValidForDomain(securityContext.MANAGE_USER_ROLES, {
        userId: [ metadata.userId ]
      })) {
        next(new Error("Not authorized!"));
        return;
      }

      // Ensure userId is valid
      const user = await entityManager.user.findOne({
        filter: {
          id: metadata.userId
        },
        projection: {
          id: true,
          avatarLink: true,
          bannerLink: true,
        }
      });
      if (!user) {
        next(new Error("Invalid userId!"));
        return; 
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
      next(new Error("Expected context, context.securityContext, and context.metadata."))
      return;
    }
    
    try {
      const user = req.context.user;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
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

      const entityManager = req.context.entityManager;
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