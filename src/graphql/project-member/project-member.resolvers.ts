import { MutationResolvers, QueryResolvers, RoleCode } from '@src/generated/graphql-endpoint.types';
import { EntityManager } from '@src/generated/typetta';
import { daoInsertRolesBatch } from '@src/utils';

export default {
  Mutation: {
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