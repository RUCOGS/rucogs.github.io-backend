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

router.get('/discord', controller.authenticateAndReturnAuthToken('discord'));
router.get('/google', controller.authenticateAndReturnAuthToken('google'));
router.post('/signin', controller.authenticateAndReturnAuthToken('local'));

router.post(
  '/signup',
  [
    VerifySignUp.checkDuplicateUsernameOrEmail,
    VerifySignUp.checkRolesExisted
  ],
  controller.signup
);

export default router;
