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
  banner: UploadWithOperation
  cardImage: UploadWithOperation
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