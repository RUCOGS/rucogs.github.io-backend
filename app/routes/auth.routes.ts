import { Express } from 'express';
import { VerifySignUp } from '../middlewares';
import * as controller from '../controllers/auth.controller';

export default function(app: Express): void {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/api/auth/signup',
    [
      VerifySignUp.checkDuplicateUsernameOrEmail,
      VerifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post('/api/auth/signin', controller.signin);
};
