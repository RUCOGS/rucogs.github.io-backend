import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newEBoard(input: NewEBoardInput!): ID!
  updateEBoard(input: UpdateEBoardInput!): Boolean
  deleteEBoard(id: ID!): Boolean

  newEBoardRole(input: NewEBoardRoleInput!): ID!
  deleteEBoardRole(id: ID!): Boolean
}

extend type Subscription {
  eBoardCreated(filter: EBoardSubscriptionFilter!): ID
  eBoardUpdated(filter: EBoardSubscriptionFilter!): ID
  eBoardDeleted(filter: EBoardSubscriptionFilter!): ID
}

input EBoardSubscriptionFilter {
  userId: ID
}

input NewEBoardRoleInput {
  eBoardId: ID!
  roleCode: RoleCode!
}

input NewEBoardInput {
  userId: ID!
}

input UpdateEBoardInput {
  id: ID!
  graduatedAt: ID!
  roles: [RoleCode!]
}
`;