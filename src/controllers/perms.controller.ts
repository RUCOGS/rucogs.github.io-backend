/**

Contains all permissions/roles related code.

 */
import { EntityManagerExtensions, isShallowEquals } from '@src/utils/utils'
import { RoleCode, } from '@src/generated/model.types';
import { AnyEntityManager } from '@src/controllers/entity-manager.controller';
import { OperationSecurityDomain, RoleData, SecurityContext, SecurityDomain } from '@src/shared/security';
import { PERMISSION } from '@twinlogix/typetta';
import { HttpError } from '@src/utils/utils';
import { RoleBackendData } from '@src/misc/backend-security';

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
    let key: keyof OperationSecurityDomain;
    for (key in operationDomain) {
      const opDomValue = operationDomain[key];
      const validDomValue = validDomain[key];
      if (opDomValue && validDomValue) {
        // OperationSecurityDomain format:
        // const operationDomain = {
        //   userId: ["dsfdsf2023f8j3f", /*OR*/ "w023f920sdfdsf", /*OR*/ "fj230f89fjfef" ],
        //   /*AND*/
        //   roleCode: ["USER", /*OR*/ "MODERATOR", /*OR*/ "SUPER_ADMIN" ],
        //   /*AND*/
        //   roleCode: ["USER", /*OR*/ "MODERATOR", /*OR*/ "SUPER_ADMIN" ],
        // }
        // If we didn't get a match inside this array
        if (!(opDomValue.some((x) => x === validDomValue))) {
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
      userId: "userId",
    },
    permissions: {
      MANAGE_USER_ROLES: PERMISSION.ALLOW,
    }
  },
  projectMemberRole: {
    domain: {
      projectMemberId: "projectMemberId",
    },
    permissions: {
      MANAGE_PROJECT_MEMBER_ROLES: PERMISSION.ALLOW,
    }
  },
  eBoard: {
    domain: {
      userId: "userId"
    },
    permissions: {
      MANAGE_EBOARD: PERMISSION.ALLOW
    },
    defaultPermissions: PERMISSION.READ_ONLY 
  },
  eBoardRole: {
    domain: {
      eboardId: "eboardId",
    },
    permissions: {
      MANAGE_EBOARD: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY
  },
};

// Centeral point to get security context.
export async function getCompleteSecurityContext(entityManager: AnyEntityManager, userId: string) {
  return mergeManySecurityContexts(
    await getUserSecurityContext(entityManager, userId), 
    await getCompleteProjectMembersSecurityContext(entityManager, userId), 
    await getEBoardSecurityContext(entityManager, userId));
}

// Each user can only have at most one eboard user, therefore we can identify it using
// the user's id.
export async function getEBoardSecurityContext(entityManager: AnyEntityManager, userId: string) {
  const eboard = await entityManager.eBoard.findOne({
    filter: {
      userId: userId
    },
    projection: {
      id: true,
      roles: {
        roleCode: true
      }
    }
  });
  if (!eboard)
    return {};
  return rolesToSecurityContext(entityManager, eboard.roles.map(x => x.roleCode), eboard.id);
}

// Uses all the project members of a user to build a single security context
export async function getCompleteProjectMembersSecurityContext(entityManager: AnyEntityManager, userId: string) {
  const members = await entityManager.projectMember.findAll({
    filter: {
      userId: userId
    },
    projection: {
      id: true
    }
  });
  let context: SecurityContext = {};
  for (const member of members) {
    context = mergeSecurityContexts(
      context,
      await getProjectMemberSecurityContext(entityManager, member.id),
    );
  }
  return context;
}

export async function getProjectMemberSecurityContext(entityManager: AnyEntityManager, projectMemberId: string) {
  const roles = await entityManager.projectMemberRole.findAll({
    filter: {
      projectMemberId: { eq: projectMemberId }
    },
    projection: {
      roleCode: true
    }
  });
  const roleCodes = roles.map(x => x.roleCode);

  return rolesToSecurityContext(entityManager, roleCodes, projectMemberId);
}

export async function getUserSecurityContext(entityManager: AnyEntityManager, userId: string) {
  const roles = await entityManager.userRole.findAll({
    filter: {
      userId: { eq: userId }
    },
    projection: {
      roleCode: true
    }
  });
  const roleCodes = roles.map(x => x.roleCode);

  return rolesToSecurityContext(entityManager, roleCodes, userId);
}

export async function rolesToSecurityContext(entityManager: AnyEntityManager, roleCodes: RoleCode[], id: string): Promise<SecurityContext> {
  // TODO: We might not need to topological sort role codes
  const sortedRoles = roleCodes; // getTopologicalSortedRoleCodes(roleCodes);
  
  let securityContext = {};
  for (const role of sortedRoles) {
    const context = await RoleBackendData[role]?.getSecurityContext(entityManager, id);
    if (context)
      securityContext = mergeSecurityContexts(securityContext, context);
  }

  return securityContext;
}

// Overload that adds support for merging any number of security contexts
export function mergeManySecurityContexts(... securityContexts: SecurityContext[]) {
  let mergedContext: SecurityContext = {};
  for (const context of securityContexts) {
    mergedContext = mergeSecurityContexts(mergedContext, context);
  }
  return mergedContext;
}

// Merges two security contexts together by
// merging the fields of one context to the other.
// If one context is a true boolean, then it takes over.
// If both contexts are arrays, then the arrays are
// meregd with one another, with any duplicate
// elements removed such that every element
// in the merged array is unique.
// 
// tdlr: Our merging preserves the most open permissions
export function mergeSecurityContexts(securityContext: SecurityContext, securityContextTwo: SecurityContext) {
  const checkedKeys = new Set<string>();
  // We run merge on each securityContext, beacuse there may have been
  // keys in one context that weren't in the other
  const mergedContext = {
    ...mergeSecurityContextHalf(securityContext, securityContextTwo, checkedKeys),
    ...mergeSecurityContextHalf(securityContextTwo, securityContext, checkedKeys)
  };
  return mergedContext;
}

// Helper method used by mergeSecurityContext.
function mergeSecurityContextHalf(securityContext: SecurityContext, securityContextTwo: SecurityContext, checkedKeys: Set<string>) {
  let mergedContext: SecurityContext = {};
  let key: keyof SecurityContext;
  for (key in securityContext) {
    // Typescript isn't happy about key traversal, so we have to use an any type
    // We skip undefined keys, because they mean nothing to us.
    if (!securityContext[key])
      continue;
  
    checkedKeys.add(key);
    if (securityContext[key] === true) {
      // We are true, therefore we use it because it's the most open permission
      mergedContext[key] = true;
    } else if (securityContextTwo[key]) {
      // Both contexts have this key
      if (securityContextTwo[key] === true) {
        // Other context has a true bool, therefore we use it
        // because it's the most open permission.
        mergedContext[key] = true;
      } else {
        // Merge two arrays, removing any duplicate items.
        // We can use shallow equality here because security
        // domains are only one level deep.
        const arrOne = securityContextTwo[key] as SecurityDomain[];
        const arrTwo = securityContextTwo[key] as SecurityDomain[];
        mergedContext[key] = arrOne.concat(arrTwo.filter(arrTwoItem => !arrOne.some(arrOneItem => isShallowEquals(arrOneItem, arrTwoItem))));
      }
    } else {
      // We only have this key, so we use it
      mergedContext[key] = securityContext[key];
    }
  }
  return mergedContext;
}

// Topological sorts the role codes such that the lowest priority
// rolecode comes first. The rolecodes at the end of the sorted array
// represent the most powerful roles.
function getTopologicalSortedRoleCodes(roles: RoleCode[]) {
  const checkedRoles: Set<RoleCode> = new Set<RoleCode>();
  let sortedRoles: RoleCode[] = [];
  for (const role of roles) {
    if (checkedRoles.has(role))
      continue;
    sortedRoles = [...getTopologicalSortedRoleCodesRecursive(checkedRoles, role), ...sortedRoles];
  }
  return sortedRoles;
}

function getTopologicalSortedRoleCodesRecursive(checkedRoles: Set<RoleCode>, role: RoleCode) {
  // Because we guard against checking the same role in the for loop, if we hit a duplicate here,
  // that means we have a cycle.
  if (checkedRoles.has(role)) {
    throw new HttpError(500, `Cyclical roles detected: "${role}" was detected twice!`);
  }
  checkedRoles.add(role);
  let sortedRoles: RoleCode[] = [];
  for (const childRole in RoleData[role].childRoles) {
    sortedRoles = [...getTopologicalSortedRoleCodesRecursive(checkedRoles, childRole as RoleCode), ...sortedRoles];
  }
  sortedRoles.push(role);
  return sortedRoles;
}