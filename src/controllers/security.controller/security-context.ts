/**

Contains all permissions/roles related code.

 */
import { AnyEntityManager, TypettaSecurityContext } from '@src/controllers/entity-manager.controller';
import { RoleCode } from '@src/generated/model.types';
import {
  BaseSecurityDomain,
  DefaultSecurityContext,
  ExtendedSecurityDomain,
  getInheritedPermRolesForRoles,
  isBaseSecurityDomain,
  isExtendedSecurityDomain,
  PermissionCode,
  RoleData,
  SecurityContext,
  SecurityDomain,
  SecurityPermissions,
} from '@src/shared/security';
import { PermissionDataDict } from '@src/shared/security/permissions';
import { HttpError, isDeepEquals } from '@src/shared/utils';
import { RoleBackendDataDict } from './role-backend';

// Caches security contexts for fast lookups
export const SECURITY_CONTEXT_CACHE = new Map<
  string,
  {
    // Time in milliseconds since Jan 1 1970 that this cache entry will expire at
    expiresAt: number;
    // Cached security context
    context: SecurityContext;
  }
>();
// LIfetime of cached security context in milliseconds
export const SECURITY_CONTEXT_CACHE_LIFETIME = 1000 * 60 * 60 * 24; // Context stays cached for an entire day
// Maximum number of cached contexts
export const SECURITY_CONTEXT_CACHE_MAX_SIZE = 100;

// Clears a user's security context cache.
// This forces a regeneration of their security context the next
// time they make a request to the API.
export function clearSecurityContext(entityManager: AnyEntityManager, userId: string) {
  SECURITY_CONTEXT_CACHE.delete(userId);
}

// Fetches a security context for a user.
// First checks the cache to see if it exists.
// If it does not, it then generates the security context.
export async function getCompleteSecurityContext(
  entityManager: AnyEntityManager,
  userId: string,
  forceClearCache: boolean = false,
) {
  const now = Date.now();

  if (!forceClearCache) {
    // Look in cache first, before trying
    const cachedContext = SECURITY_CONTEXT_CACHE.get(userId);
    if (cachedContext != undefined && now < cachedContext.expiresAt) return cachedContext.context;
  }

  // Check if user exists
  const userExists = await entityManager.user.exists({
    filter: {
      id: userId,
    },
  });
  if (!userExists) return DefaultSecurityContext;

  let context = <SecurityContext>{
    userId,
    permissions: await getCompleteSecurityPermissions(entityManager, userId),
  };

  // Delete the oldest half of the cache when the max size is reached
  if (SECURITY_CONTEXT_CACHE.size > SECURITY_CONTEXT_CACHE_MAX_SIZE) {
    // Clear half of the cache entries
    // Delete the oldest ones
    let arr = Array.from(SECURITY_CONTEXT_CACHE.entries());
    // Sort from oldest to newest
    arr.sort((a, b) => a[1].expiresAt - b[1].expiresAt);
    for (let i = 0; i < arr.length / 2; i++) {
      SECURITY_CONTEXT_CACHE.delete(arr[i][0]);
    }
  }

  SECURITY_CONTEXT_CACHE.set(userId, {
    expiresAt: now + SECURITY_CONTEXT_CACHE_LIFETIME,
    context,
  });
  return context;
}

export async function getCompleteSecurityPermissions(entityManager: AnyEntityManager, userId: string) {
  const context = mergeManySecurityPermissionss(
    await getUserSecurityPermission(entityManager, userId),
    await getCompleteProjectMembersSecurityPermissions(entityManager, userId),
    await getEBoardSecurityPermissions(entityManager, userId),
  );
  return context;
}

// Each user can only have at most one eboard user, therefore we can identify it using
// the user's id.
export async function getEBoardSecurityPermissions(entityManager: AnyEntityManager, userId: string) {
  // E-board roles are purely cosmetic and mean nothing
  // They are attached to terms to indicate an eboard member's roles during that term.
  return {};
}

// Uses all the project members of a user to build a single security context
export async function getCompleteProjectMembersSecurityPermissions(entityManager: AnyEntityManager, userId: string) {
  const members = await entityManager.projectMember.findAll({
    filter: {
      userId: userId,
    },
    projection: {
      id: true,
    },
  });
  let context: SecurityPermissions = {};
  for (const member of members) {
    context = mergeSecurityPermissions(context, await getProjectMemberSecurityPermissions(entityManager, member.id));
  }
  return context;
}

export async function getProjectMemberSecurityPermissions(entityManager: AnyEntityManager, projectMemberId: string) {
  const roles = await entityManager.projectMemberRole.findAll({
    filter: {
      projectMemberId: { eq: projectMemberId },
    },
    projection: {
      roleCode: true,
    },
  });
  const roleCodes = roles.map((x) => x.roleCode);

  return rolesToSecurityPermission(entityManager, roleCodes, projectMemberId);
}

export async function getUserSecurityPermission(
  entityManager: AnyEntityManager,
  userId: string,
): Promise<SecurityPermissions> {
  const roles = await entityManager.userRole.findAll({
    filter: {
      userId: { eq: userId },
    },
    projection: {
      roleCode: true,
    },
  });
  const roleCodes = roles.map((x) => x.roleCode);

  return rolesToSecurityPermission(entityManager, roleCodes, userId);
}

export async function rolesToSecurityPermission(
  entityManager: AnyEntityManager,
  roleCodes: RoleCode[],
  id: string,
): Promise<SecurityPermissions> {
  // Get all child roles, because we inherit their permissions
  roleCodes = getInheritedPermRolesForRoles(roleCodes);
  let securityContext = {};
  for (const role of roleCodes) {
    const context = await RoleBackendDataDict[role]?.getSecurityPermissions(entityManager, id);
    if (context) securityContext = mergeSecurityPermissions(securityContext, context);
  }

  return securityContext;
}

// Overload that adds support for merging any number of security contexts
export function mergeManySecurityPermissionss(...securityContexts: SecurityPermissions[]) {
  let mergedContext: SecurityPermissions = {};
  for (const context of securityContexts) {
    mergedContext = mergeSecurityPermissions(mergedContext, context);
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
export function mergeSecurityPermissions(
  securityContext: SecurityPermissions,
  securityContextTwo: SecurityPermissions,
) {
  const checkedKeys = new Set<string>();
  // We run merge on each securityContext, beacuse there may have been
  // keys in one context that weren't in the other
  const mergedContext = {
    ...mergeSecurityPermissionsHalf(securityContext, securityContextTwo, checkedKeys),
    ...mergeSecurityPermissionsHalf(securityContextTwo, securityContext, checkedKeys),
  };
  return mergedContext;
}

// Helper method used by mergeSecurityPermissions.
function mergeSecurityPermissionsHalf(
  contextOne: SecurityPermissions,
  contextTwo: SecurityPermissions,
  checkedKeys: Set<string>,
) {
  let mergedContext: SecurityPermissions = {};
  let permissionCode: keyof SecurityPermissions;
  for (permissionCode in contextOne) {
    const oneValue = contextOne[permissionCode];
    const twoValue = contextTwo[permissionCode];
    if (!oneValue) continue;
    checkedKeys.add(permissionCode);

    if (twoValue) {
      // We have to merge
      mergedContext[permissionCode] = mergeDomain(permissionCode, oneValue, twoValue);
    } else {
      // No merging necessary!
      mergedContext[permissionCode] = oneValue;
    }
  }
  return mergedContext;
}

function mergeBaseDomains(domainOne: BaseSecurityDomain, domainTwo: BaseSecurityDomain) {
  if (domainOne === true || domainTwo === true) return true;
  if (domainOne && domainTwo) {
    const mergedDomain: Partial<SecurityDomain>[] = [...domainOne];
    for (const two of domainTwo) {
      if (mergedDomain.some((x) => isDeepEquals(x, two))) continue;
      mergedDomain.push(two);
    }
    return mergedDomain;
  } else {
    return domainOne ?? domainTwo;
  }
}

function mergeExtendedDomains(
  permissionCode: PermissionCode,
  domainOne: ExtendedSecurityDomain,
  domainTwo: ExtendedSecurityDomain,
) {
  return <ExtendedSecurityDomain>{
    baseDomain: mergeBaseDomains(domainOne.baseDomain, domainTwo.baseDomain),
    extraData: mergeExtraData(permissionCode, domainOne, domainTwo),
  };
}

function mergeExtendedDomainWithBaseDomain(extendedDomain: ExtendedSecurityDomain, baseDomain: BaseSecurityDomain) {
  return <ExtendedSecurityDomain>{
    baseDomain: mergeBaseDomains(extendedDomain.baseDomain, baseDomain),
    extraData: extendedDomain.extraData,
  };
}

function mergeExtendedDomainWithExtraData(permissionCode: PermissionCode, domain: ExtendedSecurityDomain, data: any) {
  return <ExtendedSecurityDomain>{
    baseDomain: domain.baseDomain,
    extraData: mergeExtraData(permissionCode, domain.extraData, data),
  };
}

function mergeExtraData(permissionCode: PermissionCode, dataOne: any, dataTwo: any) {
  if (dataOne === undefined || dataTwo === undefined) return undefined;

  const permissionData = PermissionDataDict[permissionCode];
  if (permissionData && permissionData.mergeExtraData) {
    return permissionData.mergeExtraData(dataOne, dataTwo);
  }

  return dataOne;
}

function mergeDomain(permissionCode: PermissionCode, domainOne: any, domainTwo: any) {
  let result = mergeDomainHalf(permissionCode, domainOne, domainTwo);
  if (result != undefined) return result;
  result = mergeDomainHalf(permissionCode, domainTwo, domainOne);
  if (result != undefined) return result;
  // Finally, default to custom result
  return mergeExtraData(permissionCode, domainOne, domainTwo);
}

function mergeBaseDomainWithExtraData(domainOne: BaseSecurityDomain, domainTwo: any) {
  return <ExtendedSecurityDomain>{
    baseDomain: domainOne,
    extraData: domainTwo,
  };
}

function mergeDomainHalf(permissionCode: PermissionCode, domainOne: any, domainTwo: any): any {
  /**
  Extended
  Base
  Custom

  Combinations:
    Extended - Extended
    Base - Base
    Custom - Custom
    Extended - Base
    Extended - Custom
    Base - Custom
   */
  if (isExtendedSecurityDomain(domainOne)) {
    if (isExtendedSecurityDomain(domainTwo)) {
      // Extended - Extended
      return mergeExtendedDomains(permissionCode, domainOne, domainTwo);
    } else if (isBaseSecurityDomain(domainTwo)) {
      // Extended - Base
      return mergeExtendedDomainWithBaseDomain(domainOne, domainTwo);
    } else {
      // Extended - Custom
      return mergeExtendedDomainWithExtraData(permissionCode, domainOne, domainTwo);
    }
  } else if (isBaseSecurityDomain(domainOne)) {
    if (isBaseSecurityDomain(domainTwo)) {
      // Base - Base
      return mergeBaseDomains(domainOne, domainTwo);
    } else {
      // Base - Custom
      return mergeBaseDomainWithExtraData(domainOne, domainTwo);
    }
  }
  // Custom - Custom
  return undefined;
}

// Topological sorts the role codes such that the lowest priority
// rolecode comes first. The rolecodes at the end of the sorted array
// represent the most powerful roles.
function getTopologicalSortedRoleCodes(roles: RoleCode[]) {
  const checkedRoles: Set<RoleCode> = new Set<RoleCode>();
  let sortedRoles: RoleCode[] = [];
  for (const role of roles) {
    if (checkedRoles.has(role)) continue;
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

export function securityContextToTypettaSecurityContext(securityContext: SecurityContext) {
  return <TypettaSecurityContext>{
    permissions: securityPermissionsToTypettaSecurityPermissions(securityContext.permissions),
  };
}

export function securityPermissionsToTypettaSecurityPermissions(securityPermissions: SecurityPermissions) {
  const permissions: any = {};
  let permCode: keyof SecurityPermissions;
  for (permCode in securityPermissions) {
    const securityDomain = securityPermissions[permCode];
    if (isExtendedSecurityDomain(securityDomain)) {
      const extendedSecurityDomain = securityDomain as ExtendedSecurityDomain;
      permissions[permCode] = extendedSecurityDomain.baseDomain;
    } else if (isBaseSecurityDomain(securityDomain)) {
      const baseSecurityDomain = securityDomain as BaseSecurityDomain;
      permissions[permCode] = baseSecurityDomain;
    } else {
      throw new Error(`Unexpected security domain type! Object: ${JSON.stringify(securityDomain)}`);
    }
  }
  return permissions;
}
