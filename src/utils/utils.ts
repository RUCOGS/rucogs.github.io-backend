import { RoleCode } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { AbstractDAO, DAOGenerics } from "@twinlogix/typetta";

interface FindOrCreateParams {
  filter: any;
  changes: any;
  record?: any;
}

export namespace Extensions {
  async function modifyOrCreate<T extends DAOGenerics>(dao: AbstractDAO<T>, params: FindOrCreateParams) {
    try {
      await dao.updateOne({ filter: params.filter, changes: params.changes});
    } catch(e) {
      await dao.insertOne({ record: params.record ?? params.changes });
    }
  }

  async function findAndModifyOrCreate<T extends DAOGenerics>(dao: AbstractDAO<T>, params: FindOrCreateParams) {
    await modifyOrCreate(dao, params);
    return dao.findOne({ filter: params.filter });
  }
}

export namespace EntityManagerExtensions {
  export async function getOwnedProjectIds(entityManager: EntityManager, userId: string) {
    const members = await entityManager.projectMember.findAll({
      filter: {
        userId: { eq: userId },
      }
    });
    const ownershipRoles = await entityManager.projectMemberRole.findAll({
      filter: {
        projectMemberId: { in: members.map(m => m.id) },
        roleCode: { eq: RoleCode.ProjectOwner }
      }
    });
    const ownedProjectIds = members.filter(member => ownershipRoles.some(role => role.projectMemberId == member.id)).map(member => member.projectId);
    return ownedProjectIds;
  }
}
