import { MutationResolvers, Permission, QueryResolvers, RoleCode } from '@src/generated/graphql-endpoint.types';
import { EntityManager } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { daoInsertRolesBatch, HttpError, startEntityManagerTransaction } from '@src/utils';

export default {
  Mutation: {
    newProject: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext.userId)
        throw new HttpError(200, "Expected context.securityContext.userId.");
      
      // Check permissions
      if (!makePermsCalc()
          .withContext(context.securityContext)
          .hasPermission(Permission.CreateProject)) {
        throw new HttpError(401, "Not authorized!");
      }

      const userId = context.securityContext.userId;
      let newProjectId = "";
      
      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        const insertedProject = await transEntityManager.project.insertOne({
          record: {
            name: args.input.name,
            pitch: args.input.pitch,
            access: args.input.access,
            createdAt: Date.now()
          }
        });

        const projectOwner = await transEntityManager.projectMember.insertOne({
          record: {
            userId,
            projectId: insertedProject.id,
            createdAt: Date.now()
          }
        })

        await daoInsertRolesBatch({
          dao: transEntityManager.projectMemberRole, 
          roleCodes: [RoleCode.ProjectMember, RoleCode.ProjectOwner],
          idKey: "projectMemberId",
          id: projectOwner.id
        });

        newProjectId = insertedProject.id;
      });
      if (error)
        throw new HttpError(400, error.message);

      return newProjectId;
    },
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