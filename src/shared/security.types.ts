import { Permission } from "@src/generated/model.types";

export type SecurityDomain = Partial<CompleteSecurityDomain>

export type CompleteSecurityDomain = {
  userId: string;
  projectId: string;
  roleCode: string;
  projectMemberId: string;
}

export type EntityManagerMetadata = {
  securityDomain: OperationSecurityDomain;
}

export type OperationSecurityDomain = { 
  [K in keyof SecurityDomain]: CompleteSecurityDomain[K][];
}

export type SecurityContext = {
  [K in Permission]?: SecurityDomain[] | true | undefined;
}

export type SecureEntityManagerMetadata = {
  securityDomain: OperationSecurityDomain;
}

export type PermOpDomain = boolean | {
  [key: string]: boolean
}

export type PermOpDomainBundle = {
  delete: PermOpDomain,
  read: PermOpDomain,
  create: PermOpDomain,
  update: PermOpDomain
}

export type SecurityPolicies = {
  [key: string]: {
    domain: {
      [K in keyof SecurityDomain]: string
    },
    permissions: {
      [K in Permission]?: PermOpDomainBundle
    }
    defaultPermissions: PermOpDomainBundle
  }
}