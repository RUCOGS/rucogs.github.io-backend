import { RequestHandler } from 'express';
import { NativeError } from 'mongoose';
import { Config as AuthConfig } from '../config/auth.config';
import { UserModel, RoleModel, Role } from '../models';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// TODO: Replace all mongoose callbacks with ".exec()".

export const signup = function(req, res) {
  const user = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
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
      void RoleModel.findOne({ name: 'user' }, (err: NativeError, role: Role) => {
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

export const signin = function(req, res) {
  UserModel.findOne({
    username: req.body.username
  })
    // When calling populate(), make sure to pass in an object
    // that indicates what fields are populated with what types.
    // This stops typescript from complaining about nonexistant
    // fields.
    .populate<{ roles: Role[]; }>('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        });
      }

      const token = jwt.sign({ id: user.id }, AuthConfig.SECRET, {
        expiresIn: 86400 // 24 hours
      });

      const authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
} as RequestHandler;
