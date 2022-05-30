import passport, { PassportStatic } from 'passport';
import jwt from 'jsonwebtoken';
import express from 'express';
import AuthConfig from '@src/config/auth.config.json';
import { EntityManagerExtensions, TwoWayMap } from '@src/utils/utils'
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GoogleStrategy, Profile as GoogleStrategyProfile } from 'passport-google-oauth20';
import OAuth2Strategy from 'passport-oauth2';
import { RoleCode, User } from '@src/generated/model.types';
import { EntityManager, UserInsert } from '@src/generated/typetta';
import { RequestWithDefaultContext } from '@src/shared/context';
import { AnyEntityManager } from '@src/controllers/entity-manager.controller';
import { OperationSecurityDomain, SecurityContext, SecurityDomain } from '@src/shared/security.types';
import { PERMISSION } from '@twinlogix/typetta';
import { downloadToCdn } from '@src/controllers/cdn.controller';
import { HttpError } from '@src/utils/utils';

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
// #endregion // -- AUTHENTICATION ----- //

// #region // ----- PERMISSIONS ----- //
export const UserRoleCodeRanking = new TwoWayMap<string, number>({
  [RoleCode.User]: 0,
  [RoleCode.Moderator]: 1,
  [RoleCode.SuperAdmin]: 2,
});

export const ProjectMemberRoleCodeRanking = new TwoWayMap<string, number>({
  [RoleCode.ProjectMember]: 0,
  [RoleCode.ProjectOwner]: 1,
});

// Checks if a security permissionmatches the current domain.
// This method is used to check if a user has a certain permission,
// given what we want to access.
export function isPermissionDomainValidForOpDomain(permission: true | SecurityDomain[] | undefined, operationDomain: OperationSecurityDomain) {
  if (permission === undefined)
    return false;
  if (permission == true)
    return true;
  const validDomains = permission as SecurityDomain[];
  for (const validDomain of validDomains) {
    let matchedAllDomainProps = true;
    for (const key in operationDomain) {
      if (validDomain.hasOwnProperty(key)) {
        // OperationSecurityDomain format:
        // const operationDomain = {
        //   userId: ["dsfdsf2023f8j3f", /*OR*/ "w023f920sdfdsf", /*OR*/ "fj230f89fjfef" ],
        //   /*AND*/
        //   roleCode: ["USER", /*OR*/ "MODERATOR", /*OR*/ "SUPER_ADMIN" ],
        //   /*AND*/
        //   roleCode: ["USER", /*OR*/ "MODERATOR", /*OR*/ "SUPER_ADMIN" ],
        // }
        // If we didn't get a match inside this array
        if (!((<any>operationDomain)[key].some((x: any) => x === (<any>validDomain)[key]))) {
          matchedAllDomainProps = false;
          break;
        }
      }
    }
    if (matchedAllDomainProps) {
      return true;
    }
  }
  return false;
}

export const SecurityPolicies = {
  user: {
    domain: {
      userId: "id",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.UPDATE_ONLY,
      DELETE_PROFILE: PERMISSION.DELETE_ONLY,
      READ_PROFILE_PRIVATE: PERMISSION.READ_ONLY
    }, 
    defaultPermissions: {
      read: {
        __typename: true,
        avatarLink: true,
        bannerLink: true,
        createdAt: true,
        id: true,
        username: true,
        displayName: true,
        projectMembers: true,
        roles: true,
        socials: true,
        bio: true,
        
        email: false,
        loginIdentities: false,
      }
    },
  },
  project: {
    domain: {
      projectId: "id",
    },
    permissions: {
      CREATE_PROJECT: PERMISSION.CREATE_ONLY,
      DELETE_PROJECT: PERMISSION.DELETE_ONLY,
      UPDATE_PROJECT: PERMISSION.UPDATE_ONLY,
    },
    defaultPermissions: PERMISSION.READ_ONLY
  },
  userLoginIdentity: {
    domain: {
      userId: "userId",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.ALLOW,
    }
  },
  userSocial: {
    domain: {
      userId: "userId",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userRole: {
    domain: {
      roleCode: "roleCode",
      userId: "userId",
    },
    permissions: {
      MANAGE_USER_ROLES: PERMISSION.ALLOW,
    }
  },
  projectMemberRole: {
    domain: {
      roleCode: "roleCode",
      projectMemberId: "projectMemberId",
    },
    permissions: {
      MANAGE_PROJECT_MEMBER_ROLES: PERMISSION.ALLOW,
    }
  }
};

export async function authAddSecurityContext(req: RequestWithDefaultContext, res: express.Response, next: express.NextFunction) {
  if (!req.context)
    return;
  
  try {
    const entityManager = req.context.entityManager;
    const authenticated = await authenticate(req);
    if (authenticated) {
      const [authScheme, authPayload] = authenticated;
      const securityContext = await userToSecurityContext(entityManager, authPayload.userId);
      req.context.securityContext = securityContext;
    } else {
      // Fallback to no security context
      req.context.securityContext = {};
    }
    next();
  } catch (err) {
    next(err);
  }
}

export async function userToSecurityContext(entityManager: AnyEntityManager, userId: string): Promise<SecurityContext> {
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

export async function userRoleCodeToSecurityContext(entityManager: AnyEntityManager, userId: string, role: RoleCode): Promise<SecurityContext> {
  
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
// #endregion // -- PERMISSIONS ----- //