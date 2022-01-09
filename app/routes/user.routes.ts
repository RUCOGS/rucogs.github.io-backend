import { Express } from 'express';
import { AuthJwt } from '../middlewares';
import * as controller from '../controllers/user.controller';

export default function(app: Express): void {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/test/all', controller.allAccess);

  app.get('/api/test/user', [AuthJwt.verifyToken], controller.userBoard);

  app.get(
    '/api/test/mod',
    [AuthJwt.verifyToken, AuthJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    '/api/test/admin',
    [AuthJwt.verifyToken, AuthJwt.isAdmin],
    controller.adminBoard
  );
};
