import AuthConfig from '@src/config/auth.config.json';
import { downloadToCdn } from '@src/controllers/cdn.controller';
import { getCompleteSecurityContext } from '@src/controllers/security.controller/security-context';
import { RoleCode, User } from '@src/generated/model.types';
import { EntityManager, UserInsert, UserPlainModel } from '@src/generated/typetta';
import { makeUserLoginIdentity } from '@src/graphql/user-login-identity/user-login-identity.resolvers';
import { makeUser } from '@src/graphql/user/user.resolvers';
import { RequestWithDefaultContext } from '@src/misc/context';
import { isDebug } from '@src/misc/server-constructor';
import { HttpError } from '@src/shared/utils';
import { startEntityManagerTransaction } from '@src/utils';
import AsyncLock from 'async-lock';
import express from 'express';
import { MongoClient } from 'mongodb';
import passport, { PassportStatic } from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Profile as GoogleStrategyProfile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import OAuth2Strategy from 'passport-oauth2';
import { jwtSignAsync, jwtVerifyAsync } from './jwt.controller';

// #region // ----- AUTHENTICATION ----- //
export interface OAuthStrategyConfig {
  provider: string;
  module: string;
  authenticateConfig: {
    failureRedirect: string;
    failureFlash: boolean;
  };
  strategyConfig: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
}

export function configPassport(passport: PassportStatic, entityManager: EntityManager, mongoClient: MongoClient) {
  passport.use(
    new DiscordStrategy(
      <DiscordStrategy.StrategyOptions>AuthConfig.oauth.discord.strategyConfig,
      getOAuthStrategyPassportCallback<DiscordStrategy.Profile>(
        entityManager,
        mongoClient,
        'discord',
        async (profile) => profile.id,
        async (profile) => ({
          email: profile.email ?? '',
          username: profile.username.toLowerCase(),
          avatarLink: profile.avatar
            ? await downloadToCdn({
                url: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}?size=256`,
                filename: 'avatar',
              })
            : '',
          bannerLink: profile.banner
            ? await downloadToCdn({
                url: `https://cdn.discordapp.com/banners/${profile.id}/${profile.banner}?size=512`,
                filename: 'banner',
              })
            : '',
          displayName: profile.username,
        }),
        async (profile) => profile.username.toLowerCase() + profile.discriminator,
        async (profile) => ({}),
      ),
    ),
  );
  passport.use(
    new GoogleStrategy(
      AuthConfig.oauth.google.strategyConfig,
      getOAuthStrategyPassportCallback<GoogleStrategyProfile>(
        entityManager,
        mongoClient,
        'google',
        async (profile) => profile.id,
        async (profile) => ({
          email: profile._json.email ?? '',
          username: profile.displayName.replace(' ', '_').toLowerCase(),
          displayName: profile.displayName,
          avatarLink: profile._json.picture
            ? await downloadToCdn({
                url: profile._json.picture,
              })
            : '',
          bannerLink: '',
        }),
        async (profile) => profile.displayName.replace(' ', '_').toLowerCase() + profile.id,
        async (profile) => ({}),
      ),
    ),
  );
}

const createNewUser = new AsyncLock();

function getOAuthStrategyPassportCallback<TProfile extends passport.Profile>(
  entityManager: EntityManager,
  mongoClient: MongoClient,
  strategyName: string,
  profileToIdentityID: (profile: TProfile) => Promise<string>,
  profileToNewUser: (profile: TProfile) => Promise<UserInsert>,
  profileToUniqueUsername: (profile: TProfile) => Promise<string>,
  profileToData: (profile: TProfile) => Promise<unknown>,
) {
  // Use the arguments to construct the specialized callback funciton
  return (accessToken: string, refreshToken: string, profile: TProfile, done: OAuth2Strategy.VerifyCallback) => {
    // Wrap the contents of this async function to convert the result into the done function
    (async () => {
      const identityId = await profileToIdentityID(profile);
      return await createNewUser.acquire(identityId, async () => {
        const userLoginIdentity = await entityManager.userLoginIdentity.findOne({
          filter: {
            name: strategyName,
            identityId,
          },
          projection: {
            userId: true,
          },
        });

        if (userLoginIdentity) {
          const user = await entityManager.user.findOne({
            filter: {
              id: { eq: userLoginIdentity.userId },
            },
          });
          return user;
        }

        const userInsert = await profileToNewUser(profile);
        // If the user exists, then force this user to use the unique username
        let userExists = await entityManager.user.exists({ filter: { username: userInsert.username } });
        if (userExists) {
          let uniqueUsername = await profileToUniqueUsername(profile);
          let currUniqueUsername = uniqueUsername;
          let uniqueIndex = 0;

          // Last resort:
          // Brute force username to the next free one appending a number to the end of the unique name
          userExists = await entityManager.user.exists({ filter: { username: currUniqueUsername } });
          while (userExists) {
            currUniqueUsername = uniqueUsername + uniqueIndex;
            userExists = await entityManager.user.exists({ filter: { username: currUniqueUsername } });
            uniqueIndex++;
          }

          userInsert.username = currUniqueUsername;
        }

        let newUser: UserPlainModel | undefined;
        const error = await startEntityManagerTransaction(
          entityManager,
          mongoClient,
          async (transEntityManager, postTransFuncQueue) => {
            newUser = await makeUser({
              entityManager: transEntityManager,
              record: userInsert,
              subFuncQueue: postTransFuncQueue,
            });

            if (isDebug()) {
              // Self-promote in debug mode to make testing easier
              if (newUser.username === 'atlinx') {
                await entityManager.userRole.insertOne({
                  record: {
                    roleCode: RoleCode.SuperAdmin,
                    userId: newUser.id,
                  },
                });
              }
            }

            await makeUserLoginIdentity({
              entityManager: transEntityManager,
              record: {
                name: strategyName,
                identityId: identityId,
                data: await profileToData(profile),
                userId: newUser.id,
              },
              subFuncQueue: postTransFuncQueue,
            });
          },
        );
        if (error) throw error;
        return newUser;
      });
    })()
      .then((user: any) => {
        done(null, user);
      })
      .catch((err) => done(err));
  };
}

export type AuthPayload = {
  userId: string;
};

export const AuthScheme = {
  BasicRoot: 'basic-root',
  Bearer: 'bearer',
};

export async function authenticate(req: any): Promise<[authScheme: string, payload: AuthPayload] | undefined> {
  let args = [];

  if (req.authentication) {
    args = req.authentication.split(' ');
  } else if (req.headers) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return undefined;
    args = authHeader.split(' ');
  }

  if (args.length === 0) return undefined;

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
    throw new HttpError(
      401,
      "Basic authentication needs username and password. Format: 'basic [username]:[password]'.",
    );
  const authorized = AuthConfig.rootUsers.some(
    (user) => user.username === usernamePassword[0] && user.password === usernamePassword[1],
  );
  if (!authorized) throw new HttpError(401, 'Invalid username/password.');
  return { userId: usernamePassword[0] };
}

export async function authenticateBearerToken(args: string[]): Promise<AuthPayload> {
  try {
    if (args.length !== 2 || args[0].toLowerCase() !== AuthScheme.Bearer)
      throw new HttpError(401, "Invalid JWT authentication! Format: 'bearer [token]'.");

    const token = args[1];
    const payload = await jwtVerifyAsync<AuthPayload>(token);
    return payload;
  } catch (error: any) {
    let errorMessage = 'Token unauthorized: ';
    if (error instanceof Error) errorMessage += error.message;
    throw new HttpError(401, errorMessage);
  }
}

// Authenticates with passport and sends a JWT accessToken back.
export function passportAuthenticateUserAndSendAuthToken(strategy: string) {
  return function (req: any, res: any, next: any): void {
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
      const authToken = await jwtSignAsync({ userId: user.id }, '7d');
      console.log(
        `Authenticated user:\n${JSON.stringify(user)}\n using strategy '${strategy}' with token '${authToken}'`,
      );

      const message = JSON.stringify({
        accessToken: authToken,
        user: user,
      });

      return res.send(
        `<html><head><title>Authenticate</title></head><body></body><script>res = ${message}; window.opener.postMessage(res, "*");window.close();</script></html>`,
      );
    })(req, res, next);
  };
}

export async function authAddSecurityContext(
  req: RequestWithDefaultContext,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!req.context) return;

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
