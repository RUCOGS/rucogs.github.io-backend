/**

Contains all permissions/roles related code.

 */
import { EntityManagerExtensions, isShallowEquals } from '@src/utils/utils'
import { RoleCode, } from '@src/generated/model.types';
import { AnyEntityManager } from '@src/controllers/entity-manager.controller';
import { TypettaOperationSecurityDomain, RoleData, TypettaSecurityDomain, SecurityContext } from '@src/shared/security';
import { PERMISSION } from '@twinlogix/typetta';
import { HttpError } from '@src/utils/utils';
import { RoleBackendData } from '@src/misc/backend-security';
import { ValidationParams } from '@src/middlewares/validation.middleware';

export function roleValidation(entityManager: AnyEntityManager, securityContext: SecurityContext) {
  return <ValidationParams>{
    userRole: {
      roleCode: [
        async (newValue: RoleCode) => {
          console.log("I'm validating from roleCode #1!");
        }
      ]
    }, 
  }
};

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
    },
    defaultPermissions: PERMISSION.READ_ONLY,
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
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  projectMemberRole: {
    domain: {
      projectMemberId: "projectMemberId",
    },
    permissions: {
      MANAGE_PROJECT_MEMBER_ROLES: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
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
  const context = mergeManySecurityContexts(
    await getUserSecurityContext(entityManager, userId), 
    await getCompleteProjectMembersSecurityContext(entityManager, userId), 
    await getEBoardSecurityContext(entityManager, userId));
  return context;
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
function mergeSecurityContextHalf(contextOne: SecurityContext, contextTwo: SecurityContext, checkedKeys: Set<string>) {
  let mergedContext: SecurityContext = {};
  let key: keyof SecurityContext;
  for (key in contextOne) {
    const oneValue = contextOne[key];
    const twoValue = contextTwo[key];
    if (!oneValue)
      continue;
    checkedKeys.add(key);

    const permConfig: ;

    if (oneValue.data) {
      if (twoValue && twoValue.data) {
        // Merge the two datas together
        permConfig.data = [ ...oneValue.data, ...twoValue.data ]; 
      } else {
        mergedContext[key].data = oneValue;
      }
    }

    if (oneValue.crudDomain) {
      if (oneValue.crudDomain === true) {
        // We are true, therefore we use it because it's the most open permission
        mergedContext[key] = true;
      } else if (contextTwo[key]) {
        // Both contexts have this key
        if (contextTwo[key] === true) {
          // Other context has a true bool, therefore we use it
          // because it's the most open permission.
          mergedContext[key] = true;
        } else {
          // Merge two arrays, removing any duplicate items.
          // We can use shallow equality here because security
          // domains are only one level deep.
          const arrOne = contextTwo[key] as TypettaSecurityDomain[];
          const arrTwo = contextTwo[key] as TypettaSecurityDomain[];
          mergedContext[key] = arrOne.concat(arrTwo.filter(arrTwoItem => !arrOne.some(arrOneItem => isShallowEquals(arrOneItem, arrTwoItem))));
        }
      } else {
        // We only have this key, so we use it
        mergedContext[key] = contextOne[key];
      }
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