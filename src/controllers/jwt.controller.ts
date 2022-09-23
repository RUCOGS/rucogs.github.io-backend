import { AuthConfig } from '@src/misc/config';
import jwt from 'jsonwebtoken';

let authConfig: AuthConfig;

export function configJwtController(injectedAuthConfig: AuthConfig) {
  authConfig = injectedAuthConfig;
}

export async function jwtVerifyAsync<T>(token: string) {
  return new Promise<T>((resolve, reject) => {
    jwt.verify(token, authConfig.jwt.secret, (err, decoded) => {
      const payload = decoded as T;

      if (err || !payload) {
        return reject(err);
      }

      resolve(payload);
    });
  });
}

export async function jwtSignAsync<T extends object>(payload: T, expiresIn: string = '1hr') {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      authConfig.jwt.secret,
      {
        expiresIn,
        issuer: 'cogs.club',
      },
      (err, encoded) => {
        if (err || !encoded) {
          return reject(err);
        }
        resolve(encoded);
      },
    );
  });
}
