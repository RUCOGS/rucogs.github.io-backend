import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    newProjectMember(input: NewProjectMemberInput!): ID
    updateProjectMember(input: UpdateProjectMemberInput!): Boolean
    deleteProjectMember(id: ID!): Boolean
  }

  extend type Subscription {
    projectMemberCreated(filter: ProjectMemberSubscriptionFilter): ProjectMember
    projectMemberUpdated(filter: ProjectMemberSubscriptionFilter): ProjectMember
    projectMemberDeleted(filter: ProjectMemberSubscriptionFilter): ProjectMember
  }

  input ProjectMemberSubscriptionFilter {
    projectId: ID
    userId: ID
  }

  input NewProjectMemberInput {
    projectId: ID!
    userId: ID!
  }

  input NewProjectInviteInput {
    type: InviteType!
    userId: ID!
    projectId: ID!
  }

  input NewProjectMemberRoleInput {
    projectMemberId: ID!
    roleCode: RoleCode!
  }

  input UpdateProjectMemberInput {
    id: ID!
    contributions: String
    roles: [RoleCode!]
  }
`;
