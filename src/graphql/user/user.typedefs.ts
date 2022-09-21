import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    userCount: Int
  }

  extend type Mutation {
    newUser(input: NewUserInput!): ID
    updateUser(input: UpdateUserInput!): Boolean
    deleteUser(id: ID!): Boolean

    verifyNetId(input: VerifyNetIdInput!): Boolean
  }

  extend type Subscription {
    userCreated(filter: UserSubscriptionFilter): User
    userUpdated(filter: UserSubscriptionFilter): User
    userDeleted(filter: UserSubscriptionFilter): User
  }

  input VerifyNetIdInput {
    userId: ID
    netId: String!
  }

  input UserSubscriptionFilter {
    id: ID
  }

  input NewUserInput {
    email: String
    displayName: String!
    username: String!
  }

  input NewUserRoleInput {
    userId: ID!
    roleCode: RoleCode!
  }

  input UpdateUserInput {
    id: ID!
    displayName: String
    bio: String
    classYear: Int
    avatar: UploadWithOperation
    banner: UploadWithOperation
    socials: [UpdateUserSocialInput!]
    roles: [RoleCode!]

    email: String

    createdAt: Date
  }

  input UpdateUserSocialInput {
    platform: String!
    link: String!
    username: String!
  }
`;
