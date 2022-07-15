import { securityContextToTypettaSecurityContext, SecurityPolicy } from '@src/controllers/security.controller';
import { Permission } from '@src/generated/model.types';
import { EntityManager, EntityManagerParams } from '@src/generated/typetta';
import { dateMetadataMiddleware } from '@src/middlewares/dateMetadata.middleware';
import {
  BaseSecurityDomainFieldSet,
  EntityManagerMetadata,
  OperationSecurityDomain,
  SecurityContext,
} from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { PERMISSION } from '@twinlogix/typetta';
import { Db, ObjectId } from 'mongodb';

export type TypettaSecurityContext = {
  permissions: TypettaSecurityContextPerms;
};

export type TypettaSecurityContextPerms = {
  [K in Permission]?: BaseSecurityDomainFieldSet[] | true;
};

export type AnyEntityManager = EntityManager | SecureEntityManager;
export type SecureEntityManager = EntityManager<never, EntityManagerMetadata, Permission, BaseSecurityDomainFieldSet>;
export type SecureEntityManagerParams = EntityManagerParams<
  never,
  EntityManagerMetadata,
  Permission,
  BaseSecurityDomainFieldSet
>;
export type UnsecureEntityManagerParams = EntityManagerParams<never, never, never, never>;

function getScalars() {
  return {
    ID: {
      modelToDB: (value: string) => new ObjectId(value),
      dbToModel: (value: unknown) => {
        if (value && typeof value === 'object') {
          return value.toString();
        } else {
          throw new HttpError(400, 'Unexpected value for ID.');
        }
      },
    },
    Date: {
      generate: () => Date.now(),
    },
  } as EntityManagerParams<never, never, never, never>['scalars'];
}

export function getOperationMetadataFromRequest(req: any) {
  if (req.headers) {
    const metadataHeader = req.headers['operation-metadata'] as string;
    if (!metadataHeader) return undefined;
    const metadata = JSON.parse(metadataHeader);
    return metadata;
  }
  return {};
}

export function createUnsecureEntityManager(db: Db | 'mock'): EntityManager {
  return new EntityManager({
    mongodb: {
      default: db,
    },
    middlewares: [dateMetadataMiddleware(getScalars()!.Date!.generate!)],
    scalars: getScalars(),
  });
}

export function createSecureEntityManager(
  securityContext: SecurityContext,
  db: Db | 'mock',
  overrideOperationMetadata: EntityManagerMetadata | undefined = undefined,
): SecureEntityManager {
  const context = securityContextToTypettaSecurityContext(securityContext);
  return new EntityManager<never, EntityManagerMetadata, Permission, BaseSecurityDomainFieldSet>({
    mongodb: {
      default: db,
    },
    log: true,
    middlewares: [dateMetadataMiddleware(getScalars()!.Date!.generate!)],
    scalars: getScalars(),
    security: {
      applySecurity: securityContext != null,
      context,
      policies: SecurityPolicy,
      defaultPermission: PERMISSION.DENY,
      // 'metadata' is the metadata passed into a EntityManager call.
      // Here you're specify how you want to fetch the current call's domain.
      // We're planning on storing our current domain under metadata.security.
      operationDomain: (operationMetadata) => {
        let domains = operationMetadata?.securityDomains;
        if (overrideOperationMetadata) {
          domains = overrideOperationMetadata.securityDomains;
        }
        return operationDomainsToTypettaOperationDomains(domains);
      },
    },
  });
}

type TypettaDomain = {
  [key in keyof BaseSecurityDomainFieldSet]?: string[];
};

function operationDomainsToTypettaOperationDomains(domains: OperationSecurityDomain[] | undefined) {
  if (!domains) return undefined;
  const tyepttaDomains: TypettaDomain[] = [];
  for (const domain of domains) {
    const typettaDomain: TypettaDomain = {};
    for (const field in domain) {
      if ((<any>domain)[field] !== undefined) (<any>typettaDomain)[field] = [(<any>domain)[field]];
    }
    tyepttaDomains.push(typettaDomain);
  }
  return tyepttaDomains;
}
