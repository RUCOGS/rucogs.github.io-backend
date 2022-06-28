import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    newUserLoginIdentity(input: NewUserLoginIdentityInput!): ID
    updateUserLoginIdentity(input: UpdateUserLoginIdentityInput!): Boolean
    deleteUserLoginIdentity(id: ID!): Boolean
  }

  extend type Subscription {
    userLoginIdentityCreated(filter: UserLoginIdentitySubscriptionFilter!): ID
    userLoginIdentityUpdated(filter: UserLoginIdentitySubscriptionFilter!): ID
    userLoginIdentityDeleted(filter: UserLoginIdentitySubscriptionFilter!): ID
  }

  input UserLoginIdentitySubscriptionFilter {
    id: ID
  }

  input NewUserLoginIdentityInput {
    identityId: ID!
    userId: ID!
    name: String!
  }

  input UpdateUserLoginIdentityInput {
    name: String
    identityId: ID
    data: Json
  }
`;
