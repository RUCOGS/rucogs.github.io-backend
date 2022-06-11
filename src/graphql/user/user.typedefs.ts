import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  updateUser(input: UpdateUserInput!): Boolean

  newUserRole(input: NewUserRoleInput!): ID!
  deleteUserRole(id: ID!): Boolean
}

input NewUserRoleInput {
  userId: ID!
  roleCode: RoleCode!
}

input UpdateUserInput {
  id: ID!
  displayName: String
  bio: String
  avatar: UploadWithOperation
  banner: UploadWithOperation
  socials: [UpdateUserSocialInput!]
  roles: [RoleCode!]
}

input UpdateUserSocialInput {
  platform: String!
  link: String!
  username: String!
}
`;