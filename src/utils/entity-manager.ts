import { AnyEntityManager } from "@src/controllers/entity-manager.controller";
import { BaseSecurityDomainFields } from "@src/shared/security";
import { RoleCode } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { AbstractDAO, DAOGenerics } from "@twinlogix/typetta";

interface FindOrCreateParams {
  filter: any;
  changes: any;
  record?: any;
}

export type Nullable<T> = { [K in keyof T]: T[K] | null };

// Compares the properties of one object against the
// properties of another object.
export function isShallowEquals(o1: any, o2: any){
    for(var p in o1){
        if(o1.hasOwnProperty(p)){
            if(o1[p] !== o2[p]){
                return false;
            }
        }
    }
    for(var p in o2){
        if(o2.hasOwnProperty(p)){
            if(o1[p] !== o2[p]){
                return false;
            }
        }
    }
    return true;
};

export namespace EntityManagerExtensions {
  export async function modifyOrCreate<T extends DAOGenerics>(dao: AbstractDAO<T>, params: FindOrCreateParams) {
    try {
      await dao.updateOne({ filter: params.filter, changes: params.changes});
    } catch(e) {
      await dao.insertOne({ record: params.record ?? params.changes });
    }
  }

  export async function findAndModifyOrCreate<T extends DAOGenerics>(dao: AbstractDAO<T>, params: FindOrCreateParams) {
    await modifyOrCreate(dao, params);
    return dao.findOne({ filter: params.filter });
  }
}

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
  }
}