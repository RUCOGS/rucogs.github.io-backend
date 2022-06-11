import { MutationResolvers, Permission, Project, QueryResolvers, RoleCode } from '@src/generated/graphql-endpoint.types';
import { EntityManager, ProjectDAO, ProjectMemberDAO, UserDAO } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { assertProjectHasMember, assertProjectHasOwner } from '@src/shared/validation';
import { assertRequesterCanManageRoleCodes, daoInsertRolesBatch, EntityRoleResolverOptions, isDefined, newEntityRoleResolver, startEntityManagerTransaction } from '@src/utils';
import { PartialDeep } from 'type-fest';

const roleResolverOptions = <EntityRoleResolverOptions>{
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
    updateProjectMember: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          projectMemberId: [ args.input.id ]
        }).assertPermission(Permission.UpdateProjectMember);
      
      const projectMember = await context.unsecureEntityManager.projectMember.findOne({
        filter: { id: args.input.id },
        projection: { projectId: true }
      })
      if (!projectMember)
        throw new HttpError(400, "Project member doesn't exist!");

      const error = startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        if (!context.securityContext.userId)
          throw new HttpError(400, "Expected context.securityContext.userId!");
        
        if (isDefined(args.input.roles)) {
          const requesterRoleCodes = await roleResolverOptions.getRequesterRoles(transEntityManager, context.securityContext.userId, args.input.id);
          if (!args.input.roles.some(x => x === RoleCode.ProjectMember))
            throw new HttpError(400, "Project Member must have Project Member role!");
          assertRequesterCanManageRoleCodes(requesterRoleCodes, args.input.roles);
          
          const project = await transEntityManager.project.findOne({ 
            filter: { id: projectMember.projectId },
            projection: ProjectDAO.projection({
              members: {
                roles: {
                  roleCode: true
                }
              }
            })
          });
          if (!project)
            throw new HttpError(200, "Project doesn't exist! DB state may be corrupted.");

          assertProjectHasOwner(project as PartialDeep<Project>);
          assertProjectHasMember(project as PartialDeep<Project>);

          await daoInsertRolesBatch({
            dao: transEntityManager.eBoardRole,
            roleCodes: args.input.roles,
            idKey: "eBoardId",
            id: args.input.id
          });
        }

        await transEntityManager.projectMember.updateOne({
          filter: { id: args.input.id },
          changes: {
            ...(isDefined(args.input.contributions) && { contributions: args.input.contributions })
          }
        });
      })
      if (error)
        throw error;

      return true;
    },

    deleteProjectMember: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          projectMemberId: [ args.id ]
        }).assertPermission(Permission.UpdateProjectMember);
      
      const projectMember = await context.unsecureEntityManager.projectMember.findOne({
        filter: { id: args.id },
        projection: { projectId: true }
      })
      if (!projectMember)
        throw new HttpError(400, "Project member doesn't exist!");
      
      // Simualte what would happen if we removed this member
      const project = await context.unsecureEntityManager.project.findOne({ 
        filter: { id: projectMember.projectId },
        projection: ProjectDAO.projection({
          members: {
            id: true,
            roles: {
              roleCode: true
            }
          }
        })
      });
      if (!project)
        throw new HttpError(200, "Project doesn't exist! DB state may be corrupted.");
      project.members = project.members.filter(x => x.id !== args.id);
      
      assertProjectHasMember(project as PartialDeep<Project>);

      return true;
    },

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