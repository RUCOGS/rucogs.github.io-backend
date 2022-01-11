import express from 'express';
import { VerifySignUp } from '../middlewares';
import * as controller from '../controllers/auth.controller';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/discord', controller.authenticateAndReturnToken.bind(null, 'discord'));
router.get('/google', controller.authenticateAndReturnToken.bind(null, 'google'));
router.post('/signin', controller.authenticateAndReturnToken.bind(null, 'local'));

router.post(
  '/signup',
  [
    VerifySignUp.checkDuplicateUsernameOrEmail,
    VerifySignUp.checkRolesExisted
  ],
  controller.signup
);

export default router;
