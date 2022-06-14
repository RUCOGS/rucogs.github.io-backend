import { DefaultSecurityContext, OperationSecurityDomain, PermissionCode, SecurityContext, SecurityPolicy } from "./types";
import { isSecurityDomainValidForOpDomain } from "./methods";
import { HttpError } from "@src/shared/utils";

export class PermissionsCalculator {
  constructor(public securityContext: SecurityContext = DefaultSecurityContext, public operationDomain: OperationSecurityDomain = {}) {}

  withContext(securityContext: SecurityContext) {
    this.securityContext = securityContext;
    return this;
  }

  withDomain(operationDomain: OperationSecurityDomain) {
    this.operationDomain = operationDomain;
    return this;
  }

  hasPermission(permissionCode: PermissionCode) {
    if (!this.securityContext)
      return false;
    return isSecurityDomainValidForOpDomain(permissionCode, this.securityContext.permissions[permissionCode], this.operationDomain);
  }

  hasAllPermissions(...permissionCodes: PermissionCode[]) {
    for (const code of permissionCodes)
      if (!this.hasPermission(code))
        return false;
    return true;
  }

  hasSomePermission(...permissionCodes: PermissionCode[]) {
    for (const code of permissionCodes)
      if (this.hasPermission(code))
        return true;
    return false;
  }

  assertAllPermissions(...permissionCodes: PermissionCode[]) {
    if (!this.hasAllPermissions(...permissionCodes))
      throw new HttpError(403, `Missing required permissions: "${permissionCodes}".`);
  }

  assertSomePermissions(...permissionCodes: PermissionCode[]) {
    if (!this.hasSomePermission(...permissionCodes))
      throw new HttpError(403, `Must have at least one permission from "${permissionCodes}".`);
  }

  assertPermission(permissionCode: PermissionCode) {
    if (!this.hasPermission(permissionCode))
      throw new HttpError(403, `Missing required permission "${permissionCode}".`);
  }
}

export class CRUDPermissionsCalculator {
  constructor(public securityPolicy: SecurityPolicy = {}) {}

  withPolicy(securityPolicy: SecurityPolicy) {
    this.securityPolicy = securityPolicy;
  }

  getCrudPermissions(entity: string, field: string) {
    this.securityPolicy[entity]
  }
}

export function makePermsCalc() { 
  return new PermissionsCalculator();
}