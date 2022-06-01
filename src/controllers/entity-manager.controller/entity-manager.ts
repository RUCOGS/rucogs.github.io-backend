import { Permission, RoleCode, Scalars } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { PERMISSION, UserInputDriverDataTypeAdapterMap } from "@twinlogix/typetta";
import { Db, ObjectId } from 'mongodb';
import { EntityManagerMetadata, BaseSecurityDomainFields, SecurityContext, OperationSecurityDomain } from "@src/shared/security";
import { roleValidation } from "@src/controllers/security.controller";
import express from 'express';
import { HttpError } from "@src/utils";
import { validationMiddleware, mergeValidationParams } from "@src/middlewares/validation.middleware";
import { securityContextToTypettaSecurityContext } from "@src/controllers/security.controller";
import { SecurityPolicies } from "@src/controllers/security.controller";

export type TypettaSecurityContext = {
  permissions: TypettaSecurityContextPerms;
}

export type TypettaSecurityContextPerms = {
  [K in Permission]?: BaseSecurityDomainFields[] | true;
}

export type AnyEntityManager = EntityManager | SecureEntityManager;
export type SecureEntityManager = EntityManager<never, EntityManagerMetadata, Permission, BaseSecurityDomainFields>;

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

export function createSecureEntityManager(securityContext: SecurityContext, db: Db, operationSecurityDomain: OperationSecurityDomain = {}): SecureEntityManager {
  const unsecureEntityManager = createUnsecureEntityManager(db);
  return new EntityManager<never, EntityManagerMetadata, Permission, BaseSecurityDomainFields>({
    mongodb: {
      default: db,
    },
    log: true,
    middlewares: [
      validationMiddleware(
        roleValidation(unsecureEntityManager, securityContext),
      )
    ],
    scalars: getScalars(),    
    security: {
      applySecurity: securityContext != null,
      context: securityContextToTypettaSecurityContext(securityContext),
      policies: <any>SecurityPolicies,
      defaultPermission: PERMISSION.DENY,
      // 'metadata' is the metadata passed into a EntityManager call.
      // Here you're specify how you want to fetch the current call's domain.
      // We're planning on storing our current domain under metadata.security.
      operationDomain: (operationMetadata) => {
        if (operationSecurityDomain) {
          return operationSecurityDomain;
        }
        return operationMetadata?.operationSecurityDomain;
      }
    },
  })
}