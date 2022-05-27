import passport, { PassportStatic } from 'passport';
import jwt, { VerifyCallback } from 'jsonwebtoken';
import AuthConfig from '@src/config/auth.config.json';
import { RequestHandler } from 'express';
import { EntityManagerExtensions, Extensions, TwoWayMap } from '@src/utils/utils'
import express from 'express';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GoogleStrategy, Profile as GoogleStrategyProfile} from 'passport-google-oauth20';
import OAuth2Strategy, { VerifyFunction } from 'passport-oauth2';
import { RoleCode, User } from '@src/generated/model.types';
import { EntityManager, UserInsert } from '@src/generated/typetta';
import { Context } from '@src/context';
import { createUnsecureEntityManager, SecurityContext, SecurityDomain } from '@src/config/entity-manager.configurer';
import { PERMISSION, projection } from '@twinlogix/typetta';
import { ObjectId } from 'mongodb';

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
        (profile) => profile.id, 
        (profile) => ({
          email: profile.email ?? "",
          name: profile.displayName,
          avatarLink: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256` : "",
          bannerLink: profile.banner ? `https://cdn.discordapp.com/banners/${profile.id}/${profile.banner}.png?size=512` : "",
        }),
        (profile) => ({ })
      )
    ));
    passport.use(new GoogleStrategy(AuthConfig.oauth.google.strategyConfig,
      getOAuthStrategyPassportCallback<GoogleStrategyProfile>(entityManager,  "google", 
        (profile) => profile.id, 
        (profile) => ({
          email: profile._json.email ?? "",
          name: profile.displayName,
          avatarLink: profile._json.picture ?? "",
        }),
        (profile) => ({ })
      )
    ));
}

function getOAuthStrategyPassportCallback<TProfile extends passport.Profile>(entityManager: EntityManager, strategyName: string, profileToIdentityID: (profile: TProfile) => string, profileToNewUser: (profile: TProfile) => UserInsert, profileToData: (profile: TProfile) => unknown) {
  // Use the arguments to construct the specialized callback funciton
  return (accessToken: string, refreshToken: string, profile: TProfile, done: OAuth2Strategy.VerifyCallback) => {
    // Wrap the contents of this async function to convert the result into the done function
    (async () => {
      const identityId = profileToIdentityID(profile); 
      
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
        const newUser = await entityManager.user.updateOne({
          filter: {
            id: userLoginIdentity.userId
          },
          changes: profileToNewUser(profile)
        });

        const user = await entityManager.user.findOne({ 
          filter: {
            id: { eq: userLoginIdentity.userId }
          }
        });
        return user;
      }

      const newUser = await entityManager.user.insertOne({
        record: profileToNewUser(profile)
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
          data: profileToData(profile),
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

export type AuthTokenPayload = {
  userId: string;
}

export async function generateAuthToken(payload: AuthTokenPayload) {
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

export async function authenticateAuthToken(req: express.Request) {
  const authHeader = req.headers["authorization"] as string;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null)
    throw new Error("Authentication token is malformed!");
  
  return await new Promise<AuthTokenPayload>((resolve, reject) => {
    jwt.verify(token, AuthConfig.jwt.secret, (err, decoded) => {
      const payload = decoded as AuthTokenPayload;

      if (err || !payload) {
        return reject(err);
      }

      resolve(payload);
    });
  })
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
      const authToken = await generateAuthToken({ userId: user.id });
      console.log(`Authenticated user:\n${JSON.stringify(user)}\n using strategy '${strategy}' with token '${authToken}'`);

      const message = JSON.stringify({
        accessToken: authToken,
        user: user
      });

      return res.send(`<html><head><title>Authenticate</title></head><body></body><script>res = ${message}; window.opener.postMessage(res, "*");window.close();</script></html>`); 
    })(req, res, next);
  };
}

export const UserRoleCodeRanking = new TwoWayMap<string, number>({
  [RoleCode.User]: 0,
  [RoleCode.Moderator]: 1,
  [RoleCode.SuperAdmin]: 2,
});

export const ProjectMemberRoleCodeRanking = new TwoWayMap<string, number>({
  [RoleCode.ProjectMember]: 0,
  [RoleCode.ProjectOwner]: 1,
});

export async function userToSecurityContext(entityManager: EntityManager, userId: string): Promise<SecurityContext> {
  const userRoles = await entityManager.userRole.findAll({
    filter: {
      userId: { eq: userId }
    }
  });

  // Sort by weakest first, and most powerful last.
  // This lets us spread the roles, which lets the 
  // later roles have precedence and can override any
  // permissions of the weaker roles
  userRoles.sort((a, b) => UserRoleCodeRanking.get(a.roleCode) - UserRoleCodeRanking.get(b.roleCode));
  let securityContext: SecurityContext = {};
  for (const role of userRoles) {
    securityContext = { ...securityContext, ...(await userRoleCodeToSecurityContext(entityManager, userId, role.roleCode))};
  }
  return securityContext;
}

export async function userRoleCodeToSecurityContext(entityManager: EntityManager, userId: string, role: RoleCode): Promise<SecurityContext> {
  
  switch (role) {
    case RoleCode.User:
      // ----- Project Domains ----- //
      const ownedProjectIds = await EntityManagerExtensions.getOwnedProjectIds(entityManager, userId);
      const projectDomains = ownedProjectIds.map(projectId => <SecurityDomain>{ projectId });

      // ----- Project Member Role Domains ----- //
      const projectMembers = await entityManager.projectMember.findAll({
        filter: {
          userId: { eq: userId },
        }
      });
      let projectMemberRoleDomains: SecurityDomain[] = [];
      for (const member in projectMembers) {
        projectMemberRoleDomains = [...projectMemberRoleDomains, ...await EntityManagerExtensions.getProjectMemberRoleDomains(entityManager, userId)];
      }

      // ----- User Role Domains ----- //
      const userRoleDomains = await EntityManagerExtensions.getUserRoleDomains(entityManager, userId);

      return {
        READ_PROFILE_PRIVATE: [{ userId: userId }],
        UPDATE_PROFILE: [{ userId: userId }],
        CREATE_PROJECT: true,
        UPDATE_PROJECT: projectDomains,
        MANAGE_USER_ROLES: userRoleDomains,
        MANAGE_PROJECT_MEMBER_ROLES: projectMemberRoleDomains,
      };
    case RoleCode.Moderator:
      return {
        UPDATE_PROFILE: true,
        CREATE_PROJECT: true,
        UPDATE_PROJECT: true,
        READ_PROFILE_PRIVATE: true,
        MANAGE_USER_ROLES: await EntityManagerExtensions.getUserRoleDomains(entityManager, userId),
        MANAGE_PROJECT_MEMBER_ROLES: true,
      };
    case RoleCode.SuperAdmin:
      return {
        UPDATE_PROFILE: true,
        DELETE_PROFILE: true,
        CREATE_PROJECT: true,
        UPDATE_PROJECT: true,
        DELETE_PROJECT: true,
        READ_PROFILE_PRIVATE: true,
        MANAGE_USER_ROLES: true,
        MANAGE_PROJECT_MEMBER_ROLES: true,
      };
    default:
      return {};
  }
}

export async function projectMemberRoleCodeToSecurityContext(entityManager: EntityManager, projectMemberId: string, role: RoleCode): Promise<SecurityContext> {
  switch (role) {
    case RoleCode.ProjectMember:
    case RoleCode.ProjectOwner:
      return {
        MANAGE_PROJECT_MEMBER_ROLES: await EntityManagerExtensions.getProjectMemberRoleDomains(entityManager, projectMemberId),
      };
    default:
      return {};
  }
}
