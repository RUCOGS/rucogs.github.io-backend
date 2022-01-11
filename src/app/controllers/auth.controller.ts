import { RequestHandler } from 'express';
import { NativeError } from 'mongoose';
import { UserModel, RoleModel, Role } from '../models';
import bcrypt from 'bcryptjs';

// TODO: Replace all mongoose callbacks with ".exec()".

export const signup = function(req, res) {
  const newUser = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      // Assign the roles specified in req.body.roles.
      void RoleModel.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: 'User was registered successfully!' });
          });
        }
      );
    } else {
      // Assing just the user role by default if no roles are specified.
      RoleModel.findOne({ name: 'user' })
        .exec((err: NativeError, role: Role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = [role._id];
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: 'User was registered successfully!' });
          });
        });
    }
  });
} as RequestHandler;
