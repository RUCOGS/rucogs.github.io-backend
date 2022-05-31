import { Permission, RoleCode, Scalars } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { PERMISSION, UserInputDriverDataTypeAdapterMap } from "@twinlogix/typetta";
import { Db, ObjectId } from 'mongodb';
import { EntityManagerMetadata, TypettaSecurityDomain, SecurityContext } from "@src/shared/security";
import { roleValidation, SecurityPolicies } from "@src/controllers/perms.controller";
import express from 'express';
import { HttpError } from "@src/utils/utils";
import { validationMiddleware as validationMiddleware, mergeValidationParams } from "@src/middlewares/validation.middleware";
import { securityContextToTypettaSecurityContext } from "@src/misc/backend-security";

export type TypettaSecurityContext = {
  permissions: TypettaSecurityContextPerms;
}

export type TypettaSecurityContextPerms = {
  [K in Permission]?: TypettaSecurityDomain[] | true;
}

export type AnyEntityManager = EntityManager | SecureEntityManager;
export type SecureEntityManager = EntityManager<never, EntityManagerMetadata, Permission, TypettaSecurityDomain>;

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

export function createSecureEntityManager(securityContext: SecurityContext, db: Db, overrideMetadata: EntityManagerMetadata | undefined = undefined): SecureEntityManager {
  const unsecureEntityManager = createUnsecureEntityManager(db);
  return new EntityManager({
    mongodb: {
      default: db,
    },
    log: true,
    middlewares: [
      securityMiddleware(),
      validationMiddleware(
        roleValidation(unsecureEntityManager, securityContext),
      )
    ],
    scalars: getScalars(),
  })
}