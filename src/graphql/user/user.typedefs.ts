import { Permission } from "@src/generated/model.types";
import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  updateUser(input: UpdateUserInput!): Boolean
}

input UpdateUserInput {
  displayName: String
  bio: String
  avatar: Upload
  banner: Upload
  socials: [UpdateUserSocialInput!]
}

input UpdateUserSocialInput {
  platform: String!
  link: String!
  username: String!
}
`;