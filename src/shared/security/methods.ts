// Checks if a security permission matches the current domain.
// This method is used to check if a user has a certain permission,

import { PermissionDataDict } from './permissions';
import {
  BaseSecurityDomain,
  BaseSecurityDomainFieldSet,
  ExtendedSecurityDomain,
  isBaseSecurityDomain,
  isExtendedSecurityDomain,
  OperationSecurityDomain,
  PermissionCode,
  SecurityDomain,
} from './types';

export function isSecurityDomainValidForOpDomain(
  permissionCode: PermissionCode,
  domain: SecurityDomain,
  operationDomain: OperationSecurityDomain,
) {
  if (!operationDomain || !domain) return false;

  if (isBaseSecurityDomain(domain)) {
    const baseSecurityDomain = domain;
    return isBaseDomainValidForOpDomain(baseSecurityDomain, operationDomain);
  } else if (isExtendedSecurityDomain(domain)) {
    const extendedSecurityDomain = domain;
    return isExtendedDomainValidForOpDomain(permissionCode, extendedSecurityDomain, operationDomain);
  }
  // Default to extra data
  return isExtraDataValidForOpDomain(permissionCode, domain, operationDomain);
}

export function isExtendedDomainValidForOpDomain(
  permissionCode: PermissionCode,
  domain: ExtendedSecurityDomain,
  operationDomain: OperationSecurityDomain,
) {
  const validBaseDomain = isBaseDomainValidForOpDomain(domain.baseDomain, operationDomain);
  if (!validBaseDomain) return false;
  return isExtraDataValidForOpDomain(permissionCode, domain.extraData, operationDomain);
}

export function isExtraDataValidForOpDomain(
  permissionCode: PermissionCode,
  extraData: any,
  operationDomain: OperationSecurityDomain,
) {
  if (PermissionDataDict[permissionCode]) {
    const isExtraDataValidForDomainFn = PermissionDataDict[permissionCode]?.isExtraDataValidForOpDomain;
    if (isExtraDataValidForDomainFn) {
      return isExtraDataValidForDomainFn(extraData, operationDomain);
    }
  }
  return false;
}

// given what we want to access.
export function isBaseDomainValidForOpDomain(domain: BaseSecurityDomain, operationDomain: OperationSecurityDomain) {
  if (domain === undefined) return false;
  if (domain == true) return true;

  const validDomainFieldSets = domain as BaseSecurityDomainFieldSet[];
  for (const validDomain of validDomainFieldSets) {
    let matchedAllDomainProps = true;
    for (const key in operationDomain) {
      if (validDomain.hasOwnProperty(key)) {
        if ((<any>operationDomain)[key] !== (<any>validDomain)[key]) {
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
