import { Request, Response } from 'express';
import * as express from 'express';
// import { AuthJwt } from '../middlewares';
import { UserDoc, UserModel, PublicUser } from '@app/models';
import { AuthJwt } from '@app/middlewares';
import { toTypeInstance } from '@app/utils';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  res.type('json');
  next();
});

// TODO: Implement pagination using cursors to return only a section of all projects at a time.
//       We can move the cursor around easily without too much cost by calling cursor.skip(number of items);
//       The current implementation may overload the server if there are too many users.

router.get('/', function(req: Request, res: Response) {
  void UserModel.find({}, (err: Error, users: UserDoc[]) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    return res.status(200).send(users.map((user) => toTypeInstance<PublicUser>(user)));
  });
});

router.get('/private',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles,
    AuthJwt.hasRole('admin')
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    void UserModel.find({}, (err: Error, users: UserDoc[]) => {
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
      void UserModel.findById(id, (err: Error, user: UserDoc | false) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }
        return res.status(200).send(user);
      });
    } else {
      return res.status(403).send({ message: 'Unauthorized.' });
    }
  });

router.get('/:id',
  (req: Request, res: Response) => {
    const { id } = req.params;

    // Mongoose automatically casts string ids to ObjectIds.
    void UserModel.findById(id, (err: Error, user: UserDoc | false) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      return res.status(200).send(toTypeInstance<PublicUser>(user));
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

    void UserModel.create(req.body, (err: Error, user: UserDoc) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }

      return res.status(201).send(user);
    });
  });

router.put('/:id',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    const { id } = req.params;

    if ((id === req.userId && !('roles' in req.body)) || req.hasRole('admin')) {
      void UserModel.findByIdAndUpdate(id,
        {
          $set: req.body
        },
        {
          returnDocument: 'after',
          runValidators: true
        },
        (err, user) => {
          if (err) {
            return res.status(400).send({ message: err.message });
          }
          if (!user) {
            return res.status(404).send({ message: 'User not found.' });
          }

          return res.status(200).send(user);
        });
    } else {
      return res.status(403).send({ message: 'Unauthorized.' });
    }
  });

router.delete('/:id',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    const { id } = req.params;

    if (id === req.userId || req.hasRole('admin')) {
      void UserModel.findOneAndDelete({ _id: id },
        (err: Error, user: UserDoc | false) => {
          if (err) {
            return res.status(400).send({ message: err.message });
          }
          if (!user) {
            return res.status(404).send({ message: 'User not found.' });
          }

          return res.status(200).send(user);
        });
    } else {
      return res.status(403).send({ message: 'Unauthorized.' });
    }
  });

export default router;
