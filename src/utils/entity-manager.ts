import { AbstractDAO, DAOGenerics } from "@twinlogix/typetta";

interface FindOrCreateParams {
  filter: any;
  changes: any;
  record?: any;
}

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