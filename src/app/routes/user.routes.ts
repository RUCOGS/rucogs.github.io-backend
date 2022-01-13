import { Request, Response } from 'express';
import * as express from 'express';
// import { AuthJwt } from '../middlewares';
import { User, UserModel } from '@app/models';
import { getPublicUser } from '@app/models/user.model';
import { AuthJwt } from '@app/middlewares';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// TODO: Implement pagination using cursors to return only a section of all projects at a time.
//       We can move the cursor around easily without too much cost by calling cursor.skip(number of items);
//       The current implementation may overload the server if there are too many users.

router.get('/', [AuthJwt.verifyToken], function(req: Request, res: Response) {
  UserModel.find({})
    .exec((err, users: User[]) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).send(users.map((user) => getPublicUser(user)));
    });
});

router.get('/private',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles,
    AuthJwt.hasRole('admin')
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    UserModel.find({})
      .exec((err, users: User[]) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        return res.status(200).send(users);
      });
  });

router.get('/:id/private',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    const { id } = req.params;

    if (req.userId === id || req.hasRole('admin')) {
      UserModel.find({})
        .exec((err, users: User[]) => {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
          return res.status(200).send(users.map((user) => getPublicUser(user)));
        });
    }
  });

router.get('/:id',
  [
    AuthJwt.verifyToken
  ],
  (req: Request, res: Response) => {
    const { id } = req.params;

    // Mongoose automatically casts string ids to ObjectIds.
    UserModel.findById(id)
      .exec((err, user: User) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }

        return res.status(200).send(getPublicUser(user));
      });
  });

router.post('/',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles,
    // Only admins can create accounts directly
    AuthJwt.hasRole('admin')
  ],
  (req: Request, res: Response) => {
    // TODO: Add email verification
    //       See this: https://stackoverflow.com/questions/39092822/how-to-confirm-email-address-using-express-node

    UserModel.create(req.body, (err: Error, user: User) => {
      if (err) {
        res.status(500).send({ message: err.message });
      }
    });
  });

router.put('/:id',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    const { id } = req.params;

    if (id === req.userId || req.hasRole('admin')) {
      void UserModel.findByIdAndUpdate(id,
        {
          $setOnInsert: req.body
        },
        {
          new: true
        },
        (err, user) => {
          if (err) {
            res.status(500).send({ message: err.message });
            return;
          }

          res.status(200);
        });
    }
  });

export default router;
