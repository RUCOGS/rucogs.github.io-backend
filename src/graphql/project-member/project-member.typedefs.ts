import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  updateProjectMember(input: UpdateProjectMemberInput!): Boolean
  deleteProjectMember(id: ID!): Boolean
  
  newProjectMemberRole(input: NewProjectMemberRoleInput!): ID!
  deleteProjectMemberRole(id: ID!): Boolean
}

extend type Subscription {
  projectMemberCreated(filter: ProjectMemberSubscriptionFilter!): ID
  projectMemberUpdated(filter: ProjectMemberSubscriptionFilter!): ID
  projectMemberDeleted(filter: ProjectMemberSubscriptionFilter!): ID
}

input ProjectMemberSubscriptionFilter {
  projectId: ID
  userId: ID
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