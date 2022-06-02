// Checks if a security permission matches the current domain.
// This method is used to check if a user has a certain permission,

import { BaseSecurityDomain, BaseSecurityDomainFieldSet, ExtendedSecurityDomain, isBaseSecurityDomain, isExtendedSecurityDomain, OperationSecurityDomain, PermissionCode, SecurityDomain } from "./index";

export function isSecurityDomainValidForOpDomain(permissionCode: PermissionCode, domain: SecurityDomain, operationDomain: OperationSecurityDomain) {  
  if (isBaseSecurityDomain(domain)) {
    const baseSecurityDomain = domain as BaseSecurityDomain;
    return isBaseDomainValidForOpDomain(baseSecurityDomain, operationDomain);
  } else if (isExtendedSecurityDomain(domain)) {
    const extendedSecurityDomain = domain as ExtendedSecurityDomain;
    return isExtendedDomainValidForOpDomain(permissionCode, extendedSecurityDomain, operationDomain);
  }
  // Default to extra data
  return isExtraDataValidForOpDomain(permissionCode, domain, operationDomain);
}

export function isExtendedDomainValidForOpDomain(permissionCode: PermissionCode, domain: ExtendedSecurityDomain, operationDomain: OperationSecurityDomain) {
  const validBaseDomain = isBaseDomainValidForOpDomain(domain.baseDomain, operationDomain);
  if (!validBaseDomain)
    return false;
  return isExtraDataValidForOpDomain(permissionCode, domain.extraData, operationDomain);
}

export function isExtraDataValidForOpDomain(permissionCode: PermissionCode, extraData: any, operationDomain: OperationSecurityDomain) {

}

// given what we want to access.
export function isBaseDomainValidForOpDomain(domain: BaseSecurityDomain, operationDomain: OperationSecurityDomain) {
  if (domain === undefined)
    return false;
  if (domain == true)
    return true;
  
  const validDomainFieldSets = domain as BaseSecurityDomainFieldSet[];
  for (const validDomain of validDomainFieldSets) {
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