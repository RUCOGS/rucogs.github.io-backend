import { MutationResolvers, QueryResolvers, RoleCode } from '@src/generated/graphql-endpoint.types';
import { EntityManager, ProjectMemberDAO, UserDAO } from '@src/generated/typetta';
import { daoInsertRolesBatch, getEntityRoleCodes, newEntityRoleResolver } from '@src/utils';

const roleResolverOptions = {
  entityCamelCaseName: "projectMember",
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

    const projectMember = await unsecureEntityManager.projectMember.findOne({
      filter: { id: roleEntityId },
      projection: ProjectMemberDAO.projection({
        project: {
          id: true
        }
      })
    })
    const requesterProjectMember = await unsecureEntityManager.projectMember.findOne({
      filter: { 
        projectId: projectMember?.project.id,
        userId: requesterUserId 
      },
      projection: ProjectMemberDAO.projection({
        roles: {
          roleCode: true
        }
      })
    })
    if (requesterProjectMember)
      requesterRoles = requesterRoles.concat(requesterProjectMember.roles.map(x => x.roleCode));
    
    return requesterRoles;
  }
};

export default {
  Mutation: {
    newProjectMemberRole: newEntityRoleResolver(roleResolverOptions),
    deleteProjectMemberRole: newEntityRoleResolver(roleResolverOptions),
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };

async function makeProjectMember(entityManager: EntityManager, userId: string, projectId: string) {
  const member = await entityManager.projectMember.insertOne({
    record: {
      userId: userId,
      projectId: projectId,
      createdAt: Date.now()
    }
  })
  await daoInsertRolesBatch({
    dao: entityManager.projectMemberRole, 
    roleCodes: [ RoleCode.ProjectMember ], 
    idKey: "projectMemberId", 
    id: member.projectId
  });
  return member;
}