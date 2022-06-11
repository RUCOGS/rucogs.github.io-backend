import { Permission } from "@src/generated/model.types";
import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newProject(input: NewProjectInput!): ID!
  updateProject(input: UpdateProjectInput!): Boolean
  deleteProject(id: ID!): Boolean
}

input UpdateProjectInput {
  id: ID!
  name: String
  pitch: String
  access: Access
  description: String
  bannerLink: String
  cardImageLink: String
  galleryImageLinks: [String!]
  soundcloudEmbedSrc: String
  downloadLinks: [String!]
}

input NewProjectInput {
  name: String!
  pitch: String!
  access: Access!
}
`;