import { Permission } from "@src/generated/model.types";
import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newProject(input: NewProjectInput!): NewProjectPayload!
  newOutgoingProjectInvite(userId: ID!, projectId: ID!): NewOutgoingProjectInvitePayload!
  newIncomingProjectInvite(projectId: ID!): NewIncomingProjectInvitePayload!
  acceptProjectInvite(inviteId: ID!): AcceptProjectInvitePayload!
  joinOpenProject(projectId: ID!): JoinOpenProjectPayload!
}

input NewProjectInput {
  name: String!
  pitch: String!
  access: Access!
}

type NewProjectPayload {
  projectId: ID!
}

type NewOutgoingProjectInvitePayload {
  inviteId: ID!
}

type NewIncomingProjectInvitePayload {
  inviteId: ID!
}

type AcceptProjectInvitePayload {
  projectMemberId: ID!
}

type AcceptProjectInvitePayload {
  projectMemberId: ID!
}

type JoinOpenProjectPayload {
  projectMemberId: ID!
}
`;