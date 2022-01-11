import express from 'express';
import { AuthJwt } from '../middlewares';
import * as controller from '../controllers/user.controller';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/test/all', controller.allAccess);

router.get('/test/user', [AuthJwt.verifyToken], controller.userBoard);

router.get(
  '/test/mod',
  [AuthJwt.verifyToken, AuthJwt.isModerator],
  controller.moderatorBoard
);

router.get(
  '/test/admin',
  [AuthJwt.verifyToken, AuthJwt.isAdmin],
  controller.adminBoard
);

export default router;
