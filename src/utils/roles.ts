import { RoleCode } from '@src/generated/graphql-endpoint.types';
import { getHighestRoles, isRoleBelowOrEqual, RoleData, RoleType } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { AbstractDAO } from '@twinlogix/typetta';

export async function getEntityRoleCodes(
  roleDao: AbstractDAO<any>,
  entityIdKey: string,
  entityId: string | undefined | null,
) {
  if (!entityId) return [];
  const roles = await roleDao.findAll({
    filter: {
      [entityIdKey]: { eq: entityId },
    },
    projection: {
      roleCode: true,
    },
  });
  return roles.map((x) => x.roleCode as RoleCode);
}

export function assertRequesterCanDeleteRoleCodes(requesterRoleCodes: RoleCode[], roleCodes: RoleCode[]) {
  const requestHighestRoleCodes = getHighestRoles(requesterRoleCodes);
  if (requestHighestRoleCodes.includes(RoleCode.SuperAdmin)) {
    // SuperAdmins can remove any role, including the SuperAdmin role
    return;
  }
  for (const roleCode of roleCodes)
    if (requestHighestRoleCodes.includes(roleCode)) throw new HttpError(403, 'Cannot remove your own highest role!');
}

export function assertRequesterCanManageRoleCodes(requesterRoleCodes: RoleCode[], roleCodes: RoleCode[]) {
  const requestHighestRoleCodes = getHighestRoles(requesterRoleCodes);
  if (requestHighestRoleCodes.includes(RoleCode.SuperAdmin)) {
    // SuperAdmins can give other users any role, including the SuperAdmin role
    return;
  }
  for (const roleCode of roleCodes) {
    let isBelowAHighestRole = false;
    for (const highestRole of requestHighestRoleCodes) {
      if (isRoleBelowOrEqual(roleCode, highestRole)) {
        isBelowAHighestRole = true;
        break;
      }
    }
    if (!isBelowAHighestRole) {
      throw new HttpError(403, 'Can only add roles below your current role!');
    }
  }
}

export function assertRolesAreOfType(roles: RoleCode[], type: RoleType) {
  for (const role of roles) {
    if (!RoleData[role].type.includes(type))
      throw new HttpError(400, `Expected roles to be of type "${RoleType[type]}"`);
  }
}
