import { Permission, Scalars } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { PERMISSION, UserInputDriverDataTypeAdapterMap } from "@twinlogix/typetta";
import { Db, ObjectId } from 'mongodb';
import { EntityManagerMetadata, SecureEntityManagerMetadata, SecurityContext, SecurityDomain } from "@src/shared/security";
import { SecurityPolicies } from "@src/controllers/perms.controller";
import express from 'express';
import { HttpError } from "@src/utils/utils";
import { ValidationMiddleware } from "@src/middlewares/validation.middleware";

export type AnyEntityManager = EntityManager | SecureEntityManager;
export type SecureEntityManager = EntityManager<never, SecureEntityManagerMetadata, Permission, SecurityDomain>;

function getScalars(): UserInputDriverDataTypeAdapterMap<Scalars, "mongo"> {
  return {
    ID: {
      modelToDB: (value: string) => new ObjectId(value),
      dbToModel: (value: unknown) => {
        if (value && typeof value === 'object') {
          return value.toString()
        } else {
          throw new HttpError(400, 'Unexpected value for ID.')
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
  return new EntityManager<never, EntityManagerMetadata, Permission, SecurityDomain>({
    mongodb: {
      default: db,
    },
    middlewares: [
      new ValidationMiddleware({
        userRole: {
          roleCode: [
            async () => {
              console.log("Heyo, I'm validating!");
              return true;
            }
          ]
        }
      })
    ],
    scalars: getScalars(),    
    security: {
      applySecurity: securityContext != null,
      context: {
        permissions: securityContext ?? {},
      },
      policies: <any>SecurityPolicies,
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