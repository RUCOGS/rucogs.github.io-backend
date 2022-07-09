import AuthConfig from '@config/auth.config.json';
import jwt from 'jsonwebtoken';

export async function jwtVerifyAsync<T>(token: string) {
  return new Promise<T>((resolve, reject) => {
    jwt.verify(token, AuthConfig.jwt.secret, (err, decoded) => {
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
      AuthConfig.jwt.secret,
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
