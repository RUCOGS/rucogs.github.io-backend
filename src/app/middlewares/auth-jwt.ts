import { Request, RequestHandler } from 'express';

import jwt, { VerifyCallback } from 'jsonwebtoken';

import { Config as AuthConfig } from '../config/auth.config';
import { RoleModel, Role, UserModel } from '../models';

// We're adding the userId property to the request when we verify the token.
// I'm defining this kind of addition as "metadata".
export interface UserIdMetadata {
  userId: string;
}

function constructUserIdMetadata(req: Request & UserIdMetadata): void {
  req.userId = '';
}

export const verifyToken = function(req: Request & UserIdMetadata, res, next) {
  constructUserIdMetadata(req);

  const token = req.headers['x-access-token'];

  if (!token || typeof token !== 'string') {
    res.status(403).send({ message: 'No token provided!' });
    return;
  }

  jwt.verify(token, AuthConfig.SECRET, function(err, decoded) {
    if (err) {
      res.status(401).send({ message: 'Unauthorized!' });
      return;
    }
    req.userId = decoded.id;
    next();
  } as VerifyCallback);
} as RequestHandler;

// We're adding the userId property to the request when we verify the token.
// I'm defining this kind of addition as "metadata".
export interface RolesMetadata {
  roles: Role[];

  hasRole: (roleName: string) => boolean;
}

function constructRolesMetadata(req: Request & RolesMetadata): void {
  req.roles = [];
  req.hasRole = (roleName: string) => {
    return req.roles.find((role) => role.name === roleName) !== undefined;
  };
}

// Requires verifyToken();
export const getRoles = function(req: Request & UserIdMetadata & RolesMetadata, res, next) {
  constructRolesMetadata(req);

  UserModel.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user === null) {
      res.status(500).send({ message: 'User does not exist.' });
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

        req.roles = roles;
        next();
      }
    );
  });
} as RequestHandler;

// Requires getRoles()
// Uses bind
export const hasRole = function(roleName: string): RequestHandler {
  return function(req: Request & RolesMetadata, res, next) {
    if (req.hasRole(roleName)) {
      next();
      return;
    }

    res.status(403).send({ message: `Unauthorized. Requires ${roleName} role!` });
  } as RequestHandler;
};
