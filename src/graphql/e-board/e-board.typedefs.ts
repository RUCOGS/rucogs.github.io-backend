import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newEBoard(input: NewEBoardInput!): ID!
  updateEBoard(input: UpdateEBoardInput!): Boolean
  deleteEBoard(id: ID!): Boolean

  newEBoardTerm(input: NewEBoardTermInput!): ID!
  updateEBoardTerm(input: UpdateEBoardTermInput!): Boolean
  deleteEBoardTerm(id: ID!): Boolean
}

extend type Subscription {
  eBoardCreated(filter: EBoardSubscriptionFilter!): ID
  eBoardUpdated(filter: EBoardSubscriptionFilter!): ID
  eBoardDeleted(filter: EBoardSubscriptionFilter!): ID

  eBoardTermCreated(filter: EBoardTermSubscriptionFilter!): ID
  eBoardTermUpdated(filter: EBoardTermSubscriptionFilter!): ID
  eBoardTermDeleted(filter: EBoardTermSubscriptionFilter!): ID
}

input EBoardSubscriptionFilter {
  userId: ID
}

input NewEBoardInput {
  userId: ID!
}

input UpdateEBoardInput {
  id: ID!
  avatar: UploadWithOperation
  bio: String
}

input EBoardTermSubscriptionFilter {
  eBoardId: ID
}

input NewEBoardTermInput {
  eBoardId: ID!
  year: Int!
}

input UpdateEBoardTermInput {
  id: ID!
  year: Int
  roles: [RoleCode!]
}
`;