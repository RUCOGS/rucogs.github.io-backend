import { Permission } from "@src/generated/model.types";
import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  sendInvite(userId: ID!, projectID: ID!): SendInvitePayload
  joinProject(userId: ID!, projectId: ID!): JoinProjectPayload
}

type SendInvitePayload {
  
}

type JoinProjectPayload {

}
`;