import express from 'express';
import { VerifySignUp } from '../middlewares';
import * as controller from '../controllers/auth.controller';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Config as AuthConfig } from '../config/auth.config';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// Authenticates with passport and sends a JWT accessToken back.
function authenticateAndReturnToken(strategy: string, req: any, res: any, next: any): void {
  console.log('Called authenticateAndReturnToken');
  passport.authenticate(strategy, { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(403).send({ message: 'Unauthorized' });
    }
    console.log('info: ' + JSON.stringify(info));
    // Each passport strategy returns a different user,
    // therefore we have to customize how we return
    // a token using each type of user.
    const accessToken = jwt.sign(user.id, AuthConfig.SECRET);
    console.log(`Authenticasted user:\n${JSON.stringify(user)}\n using strategy '${strategy}' with token '${accessToken}'`);
    return res.send({ accessToken: accessToken });
  })(req, res, next);
}

router.get('/discord', authenticateAndReturnToken.bind(null, 'discord'));
router.get('/google', authenticateAndReturnToken.bind(null, 'google'));
router.post('/signin', authenticateAndReturnToken.bind(null, 'local'));

router.post(
  '/signup',
  [
    VerifySignUp.checkDuplicateUsernameOrEmail,
    VerifySignUp.checkRolesExisted
  ],
  controller.signup
);

export default router;
