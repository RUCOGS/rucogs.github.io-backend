import passport, { PassportStatic } from 'passport';
import jwt from 'jsonwebtoken';
import express from 'express';
import AuthConfig from '@src/config/auth.config.json';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GoogleStrategy, Profile as GoogleStrategyProfile } from 'passport-google-oauth20';
import OAuth2Strategy from 'passport-oauth2';
import { User } from '@src/generated/model.types';
import { EntityManager, UserInsert } from '@src/generated/typetta';
import { RequestWithDefaultContext } from '@src/misc/context';
import { downloadToCdn } from '@src/controllers/cdn.controller';
import { HttpError } from '@src/utils';
import { getCompleteSecurityContext } from '@src/controllers/security.controller/security-context';

// #region // ----- AUTHENTICATION ----- //
export const Permissions = {
  EDIT_PROJECT: "EDIT_PROJECT",
  CREATE_PROJECT: "EDIT_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT"
}

export interface OAuthStrategyConfig {
  provider: string;
  module: string;
  authenticateConfig: {
    failureRedirect: string;
    failureFlash: boolean;
  }
  strategyConfig: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  }
}

export function configPassport(passport: PassportStatic, entityManager: EntityManager) {
    passport.use(new DiscordStrategy(<DiscordStrategy.StrategyOptions>AuthConfig.oauth.discord.strategyConfig,
      getOAuthStrategyPassportCallback<DiscordStrategy.Profile>(entityManager, "discord", 
        async (profile) => profile.id, 
        async (profile) => ({
          email: profile.email ?? "",
          username: profile.username,
          avatarLink: profile.avatar ? await downloadToCdn(`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}?size=256`, "avatar") : "",
          bannerLink: profile.banner ? await downloadToCdn(`https://cdn.discordapp.com/banners/${profile.id}/${profile.banner}?size=512`, "banner") : "",
          displayName: profile.username,
        }),
        async (profile) => ({ })
      )
    ));
    passport.use(new GoogleStrategy(AuthConfig.oauth.google.strategyConfig,
      getOAuthStrategyPassportCallback<GoogleStrategyProfile>(entityManager,  "google", 
        async (profile) => profile.id, 
        async (profile) => ({
          email: profile._json.email ?? "",
          username: profile.displayName.replace(" ", ""),
          displayName: profile.displayName,
          avatarLink: profile._json.picture ? await downloadToCdn(profile._json.picture) : "",
          bannerLink: ""
        }),
        async (profile) => ({ })
      )
    ));
}

function getOAuthStrategyPassportCallback<TProfile extends passport.Profile>(entityManager: EntityManager, strategyName: string, profileToIdentityID: (profile: TProfile) => Promise<string>, profileToNewUser: (profile: TProfile) => Promise<UserInsert>, profileToData: (profile: TProfile) => Promise<unknown>) {
  // Use the arguments to construct the specialized callback funciton
  return (accessToken: string, refreshToken: string, profile: TProfile, done: OAuth2Strategy.VerifyCallback) => {
    // Wrap the contents of this async function to convert the result into the done function
    (async () => {
      const identityId = await profileToIdentityID(profile); 
      
      const userLoginIdentity = await entityManager.userLoginIdentity.findOne({
        filter: {
          name: strategyName,
          identityId,
        },
        projection: {
          userId: true
        }
      });

      if (userLoginIdentity) {
        await entityManager.user.updateOne({
          filter: {
            id: { eq: userLoginIdentity.userId }
          },
          changes: await profileToNewUser(profile)
        })

        const user = await entityManager.user.findOne({ 
          filter: {
            id: { eq: userLoginIdentity.userId }
          }
        });
        return user;
      }

      const newUser = await entityManager.user.insertOne({
        record: await profileToNewUser(profile)
      });

      await entityManager.userRole.insertOne({
        record: {
          roleCode: 'USER',
          userId: newUser.id,
        }
      });

      await entityManager.userLoginIdentity.insertOne({
        record: {
          name: strategyName,
          identityId: identityId,
          data: await profileToData(profile),
          userId: newUser.id
        }
      });

      return newUser;
    })()
    .then((user: any) => {
      done(null, user)
    })
    .catch((err) => done(err));
  }
}

export type AuthPayload = {
  userId: string;
}

export const AuthScheme = {
  BasicRoot: "basic-root",
  Bearer: "bearer"
}

export async function authenticate(req: express.Request): Promise<[authScheme: string, payload: AuthPayload] | undefined>{
  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return undefined;
  const args = authHeader.split(' ');
  
  const authScheme = args[0].toLowerCase();
  switch (authScheme) {
    case AuthScheme.BasicRoot:
      return [authScheme, await authenticateBasicRootUserPassword(args)];
    case AuthScheme.Bearer:
      return [authScheme, await authenticateBearerToken(args)];
    default:
      return undefined;
  }
}

export async function authenticateBasicRootUserPassword(args: string[]): Promise<AuthPayload> {
  if (args.length !== 2 || args[0].toLowerCase() !== AuthScheme.BasicRoot)
    throw new HttpError(401, "Invalid user password authentication! Format: 'basic [username]:[password]'.");
  const usernamePassword = args[1].split(':');
  if (usernamePassword.length !== 2)
    throw new HttpError(401, "Basic authentication needs username and password. Format: 'basic [username]:[password]'.")
  const authorized = AuthConfig.rootUsers.some(user => user.username === usernamePassword[0] && user.password === usernamePassword[1]);
  if (!authorized)
    throw new HttpError(401, "Invalid username/password.");
  return { userId: usernamePassword[0] };
}

export async function authenticateBearerToken(args: string[]): Promise<AuthPayload> {
  try {
    if (args.length !== 2 || args[0].toLowerCase() !== AuthScheme.Bearer)
      throw new HttpError(401, "Invalid JWT authentication! Format: 'bearer [token]'.");
    
    const token = args[1];
    const payload = await jwtVerifyAsync(token);
    return payload;
  } catch (error: any) {
    let errorMessage = "Token unauthorized: ";
    if (error instanceof Error)
      errorMessage += error.message;
    throw new HttpError(401, errorMessage);
  }
}

export async function jwtVerifyAsync(token: string) {
  return new Promise<AuthPayload>((resolve, reject) => {
    jwt.verify(token, AuthConfig.jwt.secret, (err, decoded) => {
      const payload = decoded as AuthPayload;

      if (err || !payload) {
        return reject(err);
      }

      resolve(payload);
    });
  });
}

export async function jwtSignAsync(payload: AuthPayload) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, AuthConfig.jwt.secret, {
        expiresIn: '7d',
        issuer: 'rucogs.club'
      }, 
      (err, encoded) => {
        if (err || !encoded) {
          return reject(err);
        }
        resolve(encoded);
    });
  });
}

// Authenticates with passport and sends a JWT accessToken back.
export function passportAuthenticateUserAndSendAuthToken(strategy: string) {
  return function(req: any, res: any, next: any): void {
    passport.authenticate(strategy, { session: false }, async (err, user: User) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(403).send({ message: 'Unauthorized' });
      }

      // Each passport strategy returns a different user,
      // therefore we have to customize how we return
      // a token using each type of user.
      const authToken = await jwtSignAsync({ userId: user.id });
      console.log(`Authenticated user:\n${JSON.stringify(user)}\n using strategy '${strategy}' with token '${authToken}'`);

      const message = JSON.stringify({
        accessToken: authToken,
        user: user
      });

      return res.send(`<html><head><title>Authenticate</title></head><body></body><script>res = ${message}; window.opener.postMessage(res, "*");window.close();</script></html>`); 
    })(req, res, next);
  };
}

export async function authAddSecurityContext(req: RequestWithDefaultContext, res: express.Response, next: express.NextFunction) {
  if (!req.context)
    return;
  
  try {
    const entityManager = req.context.unsecureEntityManager;
    const authenticated = await authenticate(req);
    if (authenticated) {
      const [authScheme, authPayload] = authenticated;
      const securityContext = await getCompleteSecurityContext(entityManager, authPayload.userId);
      req.context.securityContext = securityContext;
    } else {
    }
    next();
  } catch (err) {
    next(err);
  }
}
// #endregion // -- AUTHENTICATION ----- //