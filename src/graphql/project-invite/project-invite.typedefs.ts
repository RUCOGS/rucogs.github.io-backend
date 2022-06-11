import { Permission } from "@src/generated/model.types";
import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newProjectInvite(input: NewProjectInviteInput!): ID!
  acceptProjectInvite(inviteId: ID!): Boolean
  deleteProjectInvite(inviteId: ID!): Boolean
  joinOpenProject(projectId: ID!): Boolean
}

input NewProjectInviteInput {
  userId: ID!
  projectId: ID!
}
`;