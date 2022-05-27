import { Permission, Scalars } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { PERMISSION, projection, UserInputDriverDataTypeAdapterMap } from "@twinlogix/typetta";
import { MongoClient, Db, ObjectId } from 'mongodb';
import express from 'express';

export type SecurityDomain = { 
  userId?: string;
  projectId?: string;
  roleCode?: string;
  projectMemberId?: string;
}

export const EMPTY_SECURITY_DOMAIN = {
  userId: null,
  projectId: null,
  roleCode: null,
  projectMemberId: null,
}

export type OperationSecurityDomain = { 
  [K in keyof SecurityDomain]: SecurityDomain[K][];
}
export type SecurityContext = {
  [K in Permission]?: SecurityDomain[] | true | undefined;
}
export type SecureEntityManagerMetadata = {
  securityDomain: OperationSecurityDomain;
}
export type SecureEntityManager = EntityManager<never, SecureEntityManagerMetadata, Permission, SecurityDomain>
let unsafeDao: SecureEntityManager

function getScalars(): UserInputDriverDataTypeAdapterMap<Scalars, "mongo"> {
  return {
    ID: {
      modelToDB: (value: string) => new ObjectId(value),
      dbToModel: (value: unknown) => {
        if (value && typeof value === 'object') {
          return value.toString()
        } else {
          throw new Error('Unexpected value for ID.')
        }
      }
    },
    Date: {
      generate: () => Date.now(),
    },
  };
}

export function getOperationMetadataFromRequest(req: express.Request) {
  const metadataHeader = req.headers["operation-metadata"] as string;
  if (!metadataHeader)
    return undefined;
  const metadata = JSON.parse(metadataHeader);
  return metadata;
}

export function createUnsecureEntityManager(db: Db): EntityManager {
  return new EntityManager({
    mongodb: {
      default: db,
    },
    scalars: getScalars(),
  });
}

export function createSecureEntityManager(securityContext: SecurityContext | undefined, db: Db, metadata: SecureEntityManagerMetadata | undefined = undefined): SecureEntityManager {
  const test = {
    context: {
      permissions: securityContext ?? {},
    }
  }
  return new EntityManager<never, { securityDomain: OperationSecurityDomain }, Permission, SecurityDomain>({
    mongodb: {
      default: db,
    },
    scalars: getScalars(),    
    security: {
      applySecurity: securityContext != null,
      context: {
        permissions: securityContext ?? {},
      },
      policies: {
        user: {
          domain: {
            userId: "id",
            projectId: null,
            roleCode: null,
            projectMemberId: null,
          },
          permissions: {
            UPDATE_PROFILE: PERMISSION.UPDATE_ONLY,
            DELETE_PROFILE: PERMISSION.DELETE_ONLY,
            READ_PROFILE_PRIVATE: PERMISSION.READ_ONLY
          }, 
          defaultPermissions: {
            read: {
              avatarLink: true,
              bannerLink: true,
              createdAt: true,
              id: true,
              name: true,
              projectMembers: true,
              roles: true,
              socials: true,
              
              email: false,
              loginIdentities: false,
            }
          },
        },
        project: {
          domain: {
            ...EMPTY_SECURITY_DOMAIN,
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
            ...EMPTY_SECURITY_DOMAIN,
            userId: "userId",
          },
          permissions: {
            UPDATE_PROFILE: PERMISSION.ALLOW,
          }
        },
        userSocial: {
          domain: {
            ...EMPTY_SECURITY_DOMAIN,
            userId: "userId",
          },
          permissions: {
            UPDATE_PROFILE: PERMISSION.ALLOW,
          }
        },
        userRole: {
          domain: {
            ...EMPTY_SECURITY_DOMAIN,
            roleCode: "roleCode",
            userId: "userId",
          },
          permissions: {
            MANAGE_USER_ROLES: PERMISSION.ALLOW,
          }
        },
        projectMemberRole: {
          domain: {
            ...EMPTY_SECURITY_DOMAIN,
            roleCode: "roleCode",
            projectMemberId: "projectMemberId",
          },
          permissions: {
            MANAGE_PROJECT_MEMBER_ROLES: PERMISSION.ALLOW,
          }
        }
      },
      defaultPermission: PERMISSION.DENY,
      // 'metadata' is the metadata passed into a EntityManager call.
      // Here you're specify how you want to fetch the current call's domain.
      // We're planning on storing our current domain under metadata.security.
      operationDomain: (operationMetadata) => {
        if (metadata) {
          return metadata.securityDomain;
        }
        return operationMetadata?.securityDomain;
      }
    },
  })
}