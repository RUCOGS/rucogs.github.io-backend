import express from 'express';
// import { AuthJwt } from '../middlewares';
import * as controller from '../controllers/user.controller';
import { UserModel } from '@app/models';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/users/:id', (req, res) => {
  
  res.send();
});

router.post('/update/user', controller.allAccess);

export default router;
