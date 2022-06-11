import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newProjectInvite(input: NewProjectInviteInput!): ID!
  acceptProjectInvite(inviteId: ID!): Boolean
  deleteProjectInvite(inviteId: ID!): Boolean
  joinOpenProject(projectId: ID!): Boolean
}

input NewProjectInviteInput {
  type: InviteType!
  userId: ID!
  projectId: ID!
}
`;