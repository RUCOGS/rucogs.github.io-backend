import { Request, RequestHandler } from 'express';

import jwt, { VerifyCallback } from 'jsonwebtoken';

import { Config as AuthConfig } from '../config/auth.config';
import { RoleModel, UserModel } from '../models';

// We're adding the userId property to the request when we verify the token.
// I'm defining this kind of addition as "metadata".
interface ReqMetadata {
  userId: string;
}

const verifyToken = function(req: Request & ReqMetadata, res, next) {
  const token = req.headers['x-access-token'];

  if (!token || typeof token !== 'string') {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, AuthConfig.SECRET, function(err, decoded) {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  } as VerifyCallback);
} as RequestHandler;

const isAdmin = function(req: Request & ReqMetadata, res, next) {
  UserModel.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // if (user === null) {
    //   res.status(500).send({ message: 'User does not exist.' });
    //   return;
    // }

    void RoleModel.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Admin Role!' });
      }
    );
  });
} as RequestHandler;

const isModerator = function(req: Request & ReqMetadata, res, next) {
  UserModel.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    void RoleModel.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Moderator Role!' });
      }
    );
  });
} as RequestHandler;

export {
  verifyToken,
  isAdmin,
  isModerator
};
