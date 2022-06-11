//#region // ----- UPLOAD HELPERS ----- //

import { deleteSelfHostedFile, isSelfHostedFile, relativeToSelfHostedFilePath } from "@src/controllers/cdn.controller";
import { RoleCode } from "@src/generated/graphql-endpoint.types";
import { EntityManager } from "@src/generated/typetta";
import { RequestContext, RequestWithContext } from "@src/misc/context";
import { HttpError } from '@src/shared/utils';
import { AbstractDAO } from "@twinlogix/typetta";
import express from "express";
import { MongoClient } from "mongodb";


export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function tryDeleteOldFileLinkFromEntity(req: RequestWithContext<RequestContext>, fileName: string, object: any): [boolean, string] {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let fileUpdated = files[fileName] && files[fileName].length == 1;
  const selfHostedFilePath = fileUpdated ? relativeToSelfHostedFilePath(files[fileName][0].path) : "";
  const oldFilePath = object[fileName + 'Link'];
  // Purge old card image if it's self hosted
  if (oldFilePath) {
    if (req.body.deletedFiles?.includes(fileName)) {
      // Reset entity's link property for the file to empty
      object[fileName + 'Link'] = "";
      deleteSelfHostedFile(oldFilePath);
      fileUpdated = true;
    } else if (fileUpdated && isSelfHostedFile(oldFilePath)) {
      deleteSelfHostedFile(oldFilePath);
    }
  }
  return [fileUpdated, selfHostedFilePath];
}

export async function getRoleCodes(roleDao: AbstractDAO<any>, idKey: string, id: string): Promise<RoleCode[]> {
  return (await roleDao.findAll({
    filter: {
      // We filter against the userId of the user
      // that's requesting this change.
      [idKey]: id
    },
    projection: {
      roleCode: true
    }
  })).map(x => x.roleCode as RoleCode)
}

export async function startEntityManagerTransaction(
  entityManager: EntityManager, 
  mongoClient: MongoClient,
  fn: (transactionEntityManager: EntityManager & {
    __transaction_enabled__: true;
  }) => Promise<void>,
): Promise<Error | undefined> {
  const session = mongoClient.startSession()
  session.startTransaction({
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  });

  let error: Error | undefined = undefined;
  try {
    await entityManager.transaction({
        mongodb: { default: session }
      },
      fn
    );
    await session.commitTransaction();
  } catch (err) {
    if (err instanceof Error)
      error = err;
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
  return error;
}

export async function startEntityManagerTransactionREST(
  req: RequestWithContext<RequestContext>, 
  next: express.NextFunction, 
  fn: (transactionEntityManager: EntityManager & {
    __transaction_enabled__: true;
  }) => Promise<void>
): Promise<Error | undefined> {
  if (!req.context || !req.context.securityContext || !req.context.securityContext.userId) {
    const error = new HttpError(400, "Expected context, context.securityContext, context.securityContext.userId, and context.metadata.");
    next(error);
    return error;
  }

  const entityManager = req.context.unsecureEntityManager;
  const mongoClient = req.context.mongoClient;
  
  const error = await startEntityManagerTransaction(entityManager, mongoClient, fn);
  if (error instanceof Error) {
    next(error);
  }
  return error;
}

export async function daoInsertBatch(options: {
  dao: AbstractDAO<any>, 
  elements: any[], 
  deleteFilter: any, 
  elementToUpdateFilter: (element: any) => any, 
  elementToRecord: (element: any) => any,
  /**
  Runs for each element that is successfully created
  or updated.
   */
  foreachSuccess?: (element: any, entityId: any) => Promise<void>;
  error?: boolean;
  create?: boolean,
  update?: boolean,
  delete?: boolean,
}) {
  if (options.error === undefined)
    options.error = true;
  if (options.create === undefined)
    options.create = true;
  if (options.update === undefined)
    options.update = true;
  if (options.delete === undefined)
    options.delete = true;

  // Delete socials that aren't part of our new updated batch.
  if (options.delete) {
    const deletedEntities = await options.dao.findAll({
      filter: options.deleteFilter,
      projection: {
        id: true
      }
    });
    await options.dao.deleteAll({
      filter: {
        id: { in: deletedEntities.map(x => x.id) }
      }
    });
  }
  // Insert the new updated batch of elements
  for (const element of options.elements) {
    const updateFilter = options.elementToUpdateFilter(element);
    let foundEntity = await options.dao.findOne({
      filter: updateFilter,
      projection: {
        id: true
      }
    });
    
    let entityAdded = false;
    if (foundEntity) {
      if (options.update) {
        await options.dao.updateOne({
          filter: updateFilter,
          changes: options.elementToRecord(element),
        });
        entityAdded = true;
      } else if (options.error) {
        throw new HttpError(403, "Forbidden from updating entities from the batch.");
      }
    } else {
      if (options.create) {
        foundEntity = await options.dao.insertOne({
          record: options.elementToRecord(element)
        });
        entityAdded = true;
      } else if (options.error) {
        throw new HttpError(403, "Forbidden from creating entities from the batch.");
      }
    }
    
    if (entityAdded && options.foreachSuccess)
      await options.foreachSuccess(element, foundEntity.id);
  }
}

export async function daoInsertRolesBatch(options: {
  dao: AbstractDAO<any>, 
  roleCodes: RoleCode[],
  idKey: string 
  id: string
}) {
  await daoInsertBatch({
    dao: options.dao,
    elements: options.roleCodes,
    // Delete Filter
    deleteFilter: {
      $and: [
        { 
          [options.idKey]: options.id, 
        },
        { 
          $nor: options.roleCodes.map(x => ({ 
            roleCode: x
          }))
        }
      ]
    },
    // Update Filter
    elementToUpdateFilter: (roleCode: RoleCode) => ( {
      [options.idKey]: options.id,
      roleCode
    }),
    // Record
    elementToRecord: (roleCode: RoleCode) => ({
      [options.idKey]: options.id,
      roleCode,
    })
  });
}

export function bodyFieldExists(req: express.Request, name: string) {
  return req.body[name] !== undefined;
}

//#endregion // -- UPLOAD HELPERS ----- //