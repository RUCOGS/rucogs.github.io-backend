import { HttpError } from '@src/shared/utils';
import { isSecurityDomainValidForOpDomain } from './methods';
import { DefaultSecurityContext, OperationSecurityDomain, PermissionCode, SecurityContext } from './types';

export class PermissionsCalculator {
  constructor(
    public securityContext: SecurityContext = DefaultSecurityContext,
    public operationDomain: OperationSecurityDomain | OperationSecurityDomain[] = {},
  ) {}

  withContext(securityContext: SecurityContext) {
    this.securityContext = securityContext;
    return this;
  }

  withDomains(operationDomain: OperationSecurityDomain[]) {
    this.operationDomain = operationDomain;
    return this;
  }

  withDomain(operationDomain: OperationSecurityDomain) {
    this.operationDomain = operationDomain;
    return this;
  }

  hasPermission(permissionCode: PermissionCode) {
    if (!this.securityContext) return false;
    if (Array.isArray(this.operationDomain)) {
      for (const domain of this.operationDomain) {
        if (isSecurityDomainValidForOpDomain(permissionCode, this.securityContext.permissions[permissionCode], domain))
          return true;
      }
      return false;
    } else {
      return isSecurityDomainValidForOpDomain(
        permissionCode,
        this.securityContext.permissions[permissionCode],
        this.operationDomain,
      );
    }
  }

  hasAllPermissions(...permissionCodes: PermissionCode[]) {
    for (const code of permissionCodes) if (!this.hasPermission(code)) return false;
    return true;
  }

  hasSomePermission(...permissionCodes: PermissionCode[]) {
    for (const code of permissionCodes) if (this.hasPermission(code)) return true;
    return false;
  }

  assertAllPermissions(...permissionCodes: PermissionCode[]) {
    if (!this.hasAllPermissions(...permissionCodes))
      throw new HttpError(403, `Missing required permissions: "${permissionCodes.toString()}".`);
  }

  assertSomePermissions(...permissionCodes: PermissionCode[]) {
    if (!this.hasSomePermission(...permissionCodes))
      throw new HttpError(403, `Must have at least one permission from "${permissionCodes.toString()}".`);
  }

  assertPermission(permissionCode: PermissionCode) {
    if (!this.hasPermission(permissionCode))
      throw new HttpError(403, `Missing required permission "${permissionCode}".`);
  }
}

export function makePermsCalc() {
  return new PermissionsCalculator();
}
