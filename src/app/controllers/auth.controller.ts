import { NativeError } from 'mongoose';
import { UserModel, RoleModel, Role } from '../models';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Config as AuthConfig } from '../config/auth.config';
import { RequestHandler } from 'express';

export const signup = function(req, res): void {
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
            return res.status(500).send({ message: err });
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              return res.status(500).send({ message: err });
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
            return res.status(500).send({ message: err });
          }

          user.roles = [role._id];
          user.save(err => {
            if (err) {
              return res.status(500).send({ message: err });
            }

            res.send({ message: 'User was registered successfully!' });
          });
        });
    }
  });
} as RequestHandler;

// Authenticates with passport and sends a JWT accessToken back.
export const authenticateAndReturnToken = function(strategy: string, req: any, res: any, next: any): void {
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
    const accessToken = jwt.sign({ id: user.id }, AuthConfig.SECRET, {
      expiresIn: '7d',
      issuer: 'rucogs.club'
    });
    console.log(`Authenticasted user:\n${JSON.stringify(user)}\n using strategy '${strategy}' with token '${accessToken}'`);

    const message = JSON.stringify({
      accessToken: accessToken
    });

    return res.send(`<html><head><title>Authenticate</title></head><body></body><script>res = ${message}; window.opener.postMessage(res, "*");window.close();</script></html>`);
  })(req, res, next);
};
