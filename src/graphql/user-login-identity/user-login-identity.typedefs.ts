import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    newUserLoginIdentity(input: NewUserLoginIdentityInput!): ID
    updateUserLoginIdentity(input: UpdateUserLoginIdentityInput!): Boolean
    deleteUserLoginIdentity(id: ID!): Boolean
  }

  extend type Subscription {
    userLoginIdentityCreated(filter: UserLoginIdentitySubscriptionFilter!): UserLoginIdentity
    userLoginIdentityUpdated(filter: UserLoginIdentitySubscriptionFilter!): UserLoginIdentity
    userLoginIdentityDeleted(filter: UserLoginIdentitySubscriptionFilter!): UserLoginIdentity
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
    id: ID!
    name: String
    identityId: ID
    data: Json
  }
`;
