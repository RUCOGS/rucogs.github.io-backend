import { MutationResolvers, QueryResolvers } from '@src/generated/graphql-endpoint.types';
import { RoleCode } from '@src/generated/model.types';
import { EBoardDAO, EntityManager, UserDAO } from '@src/generated/typetta';
import { deleteEntityRoleResolver, EntityRoleResolverOptions, getEntityRoleCodes, newEntityRoleResolver } from '@src/utils';

const roleResolverOptions = <EntityRoleResolverOptions>{
  entityCamelCaseName: "eBoard",
  entityName: "e-board",
  async getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
    const requesterUser = await unsecureEntityManager.user.findOne({
      filter: {
        id: requesterUserId
      },
      projection: UserDAO.projection({
        roles: {
          roleCode: true
        }
      })
    })
    if (!requesterUser)
      throw new Error("Expected user to exist!");
    let requesterRoles: RoleCode[] = requesterUser.roles.map(x => x.roleCode);

    const requesterEboard = await unsecureEntityManager.eBoard.findOne({
      filter: {
        userId: requesterUserId
      },
      projection: EBoardDAO.projection({
        roles: {
          roleCode: true
        }
      })
    })
    if (requesterEboard)
      requesterRoles = requesterRoles.concat(requesterEboard.roles.map(x => x.roleCode));
    
    return requesterRoles;
  }
};

export default {
  Mutation: {
    newEBoardRole: newEntityRoleResolver(roleResolverOptions),
    deleteEBoardRole: deleteEntityRoleResolver(roleResolverOptions),
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };