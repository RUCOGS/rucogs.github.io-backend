import { Permission } from "@src/generated/model.types";
import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newEBoard(input: NewEBoardInput!): ID!
  updateEBoard(input: UpdateEBoardInput!): Boolean
  deleteEBoard(id: ID!): Boolean

  newEBoardRole(input: NewEBoardRoleInput!): ID!
  deleteEBoardRole(id: ID!): Boolean
}

input NewEBoardRoleInput {
  eBoardId: ID!
  roleCode: RoleCode!
}

input NewEBoardInput {
  eBoardId: ID!
}

input UpdateEBoardInput {
  id: ID!
  graduatedAt: ID!
}
`;