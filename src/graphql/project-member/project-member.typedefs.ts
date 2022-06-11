import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  updateProjectMember(input: UpdateProjectMemberInput!): Boolean
  deleteProjectMember(id: ID!): Boolean
  
  newProjectMemberRole(input: NewProjectMemberRoleInput!): ID!
  deleteProjectMemberRole(id: ID!): Boolean
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