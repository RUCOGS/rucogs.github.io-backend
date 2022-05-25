import { Permission, Scalars } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { PERMISSION, UserInputDriverDataTypeAdapterMap } from "@twinlogix/typetta";
import { MongoClient, Db } from 'mongodb';

export type SecurityDomain = { 
  userId?: string;
  projectId?: string;
}
export type OperationSecurityDomain = { 
  [K in keyof SecurityDomain]: SecurityDomain[K][];
}
export type SecurityContext = {
  [K in Permission]?: SecurityDomain[] | true | undefined;
}
export type SecureEntityManager = EntityManager<never, { securityDomain: OperationSecurityDomain }, Permission, SecurityDomain>
let unsafeDao: SecureEntityManager

function getScalars(): UserInputDriverDataTypeAdapterMap<Scalars, "mongo"> {
  return {
    Date: {
      generate: () => Date.now(),
    },
  };
}

export function createUnsecureEntityManager(db: Db): EntityManager {
  return new EntityManager({
    mongodb: {
      default: db,
    },
    scalars: getScalars(),
  });
}

export function createSecureEntityManager(securityContext: SecurityContext | undefined, db: Db): SecureEntityManager {
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
          },
          permissions: {
            UPDATE_PROFILE: PERMISSION.UPDATE_ONLY,
            DELETE_PROFILE: PERMISSION.DELETE_ONLY,
            READ_PROFILE_PRIVATE: PERMISSION.READ_ONLY,
          }, 
          defaultPermissions: PERMISSION.DENY,
          // TODO: Add rest of permissions
        },
      },
      defaultPermission: PERMISSION.DENY,
      // 'metadata' is the metadata passed into a EntityManager call.
      // Here you're specify how you want to fetch the current call's domain.
      // We're planning on storing our current domain under metadata.security.
      operationDomain: (metadata) => metadata.securityDomain,
    },
  })
}