import AuthConfig from '@config/auth.config.json';
import jwt from 'jsonwebtoken';

export type VerifyEmailPayload = {
  userId: string;
  verifiedEmail: string;
};

export async function jwtVerifyAsync(token: string) {
  return new Promise<VerifyEmailPayload>((resolve, reject) => {
    jwt.verify(token, AuthConfig.jwt.secret, (err, decoded) => {
      const payload = decoded as VerifyEmailPayload;

      if (err || !payload) {
        return reject(err);
      }

      resolve(payload);
    });
  });
}

export async function jwtSignAsync(payload: VerifyEmailPayload) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      AuthConfig.jwt.secret,
      {
        expiresIn: '1hr',
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
