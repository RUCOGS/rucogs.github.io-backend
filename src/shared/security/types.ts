import { Permission } from "@src/generated/graphql-endpoint.types";

export type SecurityDomainTemplate = {
  userId: string;
  projectId: string;
  roleCode: string;
  projectMemberId: string;
}

/**
Represents a set of objects
 */
export type BaseSecurityDomainFieldSet = Partial<SecurityDomainTemplate>

export type EntityManagerMetadata = {
  securityDomain: OperationSecurityDomain;
}

/**
Represents the domain of entities we want to operate on.
The set of entities matched by a filter, which is stored in this.
The filter is shown in the example below:

Ex. 
const operationDomain = {
  userId: ["dsfdsf2023f8j3f", "w023f920sdfdsf", "fj230f89fjfef" ],
  roleCode: ["USER", "MODERATOR", "SUPER_ADMIN" ],
  roleCode: ["USER", "MODERATOR", "SUPER_ADMIN" ],
}

This will filter for a set of entities such that
for each entitiy:

  userId == "dsfdsf2023f8j3f", OR "w023f920sdfdsf", OR "fj230f89fjfef",
  AND
  roleCode == "USER", OR "MODERATOR", OR "SUPER_ADMIN",
  AND
  roleCode == "USER", OR "MODERATOR", OR "SUPER_ADMIN",

 */
export type OperationSecurityDomain = { 
  [K in keyof BaseSecurityDomainFieldSet]: SecurityDomainTemplate[K][];
}

export type BaseSecurityDomain = BaseSecurityDomainFieldSet[] | true;
export function isBaseSecurityDomain(object: any) {
  return object === true || (Array.isArray(object));
}

export type ExtendedSecurityDomain = {
  baseDomain: BaseSecurityDomain;
  // Extra data for more complex permissions
  extraData: any;
}
export function isExtendedSecurityDomain(object: any) {
  return object.baseDomain && isBaseSecurityDomain(object.crudDomain);
}

export type CustomSecurityDomain = any;

/**
Flexible security domains are used
during the creation of the security
domain. When we merge the domains
for final use, we convert all
flexible security domains into
regular security domains, which
have a predictable structure.

This ultimately leads to less
complexity when handling the
security domain.
 */
export type SecurityDomain = BaseSecurityDomain | ExtendedSecurityDomain | CustomSecurityDomain

/**
A class that stores the security 
permissions of a user. It contains all the
data needed to check if an operation is 
valid or not.

During an operation, the user will have
their own context generated at the start.
It will then be used to verify permissions
in other parts of the operation.
*/
export type SecurityContext = {
  userId?: string
  permissions: SecurityPermissions
}

export type SecurityPermissions = {
  /**
  Each permission holds to a SecurityDomain,
  which identifies the set of entities
  that this permission affects.
   */
  [K in PermissionCode]?: SecurityDomain;
}

export type PermissionCode = Permission;

export type CrudOperationPermissions = boolean | {
  [key: string]: boolean
}

export type CrudOperationSecurity = {
  delete: CrudOperationPermissions,
  read: CrudOperationPermissions,
  create: CrudOperationPermissions,
  update: CrudOperationPermissions
}

export type SecurityPolicy = {
  [key: string]: {
    domain: {
      [K in keyof BaseSecurityDomainFieldSet]: string
    },
    permissions: {
      [K in PermissionCode]?: CrudOperationSecurity
    }
    defaultPermissions: CrudOperationSecurity
  }
}

// CONFIG: Default security context
export const DefaultSecurityContext: SecurityContext = {
  permissions: {
    
  }
}