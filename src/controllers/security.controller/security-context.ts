/**

Contains all permissions/roles related code.

 */
import { RoleCode, } from '@src/generated/model.types';
import { AnyEntityManager } from '@src/controllers/entity-manager.controller/entity-manager';
import { RoleData, SecurityContext, isExtendedSecurityDomain, isBaseSecurityDomain, BaseSecurityDomain, ExtendedSecurityDomain, PermissionCode } from '@src/shared/security';
import { HttpError } from '@src/utils';
import { RoleBackendData } from './backend-security-settings';
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

export async function getUserSecurityContext(entityManager: AnyEntityManager, userId: string): Promise<SecurityContext> {
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
  let permissionCode: keyof SecurityContext;
  for (permissionCode in contextOne) {
    const oneValue = contextOne[permissionCode];
    const twoValue = contextTwo[permissionCode];
    if (!oneValue)
      continue;
    checkedKeys.add(permissionCode);

    if (twoValue) {
      // We have to merge
      mergedContext[permissionCode] = mergeDomain(permissionCode, oneValue.baseDomain, twoValue.baseDomain);
    } else {
      // No merging necessary!
      mergedContext[permissionCode] = oneValue;
    }
  }
  return mergedContext;
}

function mergeBaseDomains(domainOne: BaseSecurityDomain, domainTwo: BaseSecurityDomain) {
  if (domainOne === true || domainTwo === true)
    return true;
  if (domainOne) {
    
  } else {
    if (domainTwo)
      return domainTwo;
  }
}

function mergeExtendedDomains(permissionCode: PermissionCode, domainOne: ExtendedSecurityDomain, domainTwo: ExtendedSecurityDomain) {
  return <ExtendedSecurityDomain>{
    baseDomain: mergeBaseDomains(domainOne.baseDomain, domainTwo.baseDomain),
    extraData: mergeExtraData(permissionCode, domainOne, domainTwo)
  }
}

function mergeExtendedDomainWithBaseDomain(extendedDomain: ExtendedSecurityDomain, baseDomain: BaseSecurityDomain) {
  return <ExtendedSecurityDomain>{
    baseDomain: mergeBaseDomains(extendedDomain.baseDomain, baseDomain),
    extraData: extendedDomain.extraData
  }
}

function mergeExtendedDomainWithExtraData(permissionCode: PermissionCode, domain: ExtendedSecurityDomain, data: any) {
  return <ExtendedSecurityDomain>{
    baseDomain: domain.baseDomain,
    extraData: mergeExtraData(permissionCode, domain.extraData, data)
  };
}

function mergeExtraData(permissionCode: PermissionCode, dataOne: any, dataTwo: any) {
  if (dataOne === undefined || dataTwo === undefined)
    return undefined;
  // TODO: Write this and add another backend setting for helper methods of merging and creating data for 
  //       roles that use that
  return dataOne;
}

function mergeDomain(permissionCode: PermissionCode, domainOne: any, domainTwo: any) {
  let result = mergeDomainHalf(permissionCode, domainOne, domainTwo);
  if (result != undefined)
    return result;
  result = mergeDomainHalf(permissionCode, domainTwo, domainOne);
  if (result != undefined)
    return result;
  // Finally, default to custom result
  return mergeExtraData(permissionCode, domainOne, domainTwo);
}

function mergeBaseDomainWithExtraData(domainOne: BaseSecurityDomain, domainTwo: any) {
  return <ExtendedSecurityDomain>{
    baseDomain: domainOne,
    extraData: domainTwo
  }
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
  return undefined
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

export function securityContextToTypettaSecurityContext(securityContext: SecurityContext) {
  const permissions: any = {};
  let permCode: keyof SecurityContext;
  for (permCode in securityContext) {
    const securityDomain = securityContext[permCode];
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
  return {
    permissions
  };
}