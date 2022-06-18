import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newProject(input: NewProjectInput!): ID!
  updateProject(input: UpdateProjectInput!): Boolean
  deleteProject(id: ID!): Boolean
}

extend type Subscription {
  projectCreated(filter: ProjectSubscriptionFilter!): ID
  projectUpdated(filter: ProjectSubscriptionFilter!): ID
  projectDeleted(filter: ProjectSubscriptionFilter!): ID
}

input ProjectSubscriptionFilter {
  projectId: ID
}

input UpdateProjectInput {
  id: ID!
  name: String
  pitch: String
  access: Access
  description: String
  banner: UploadWithOperation
  cardImage: UploadWithOperation
  tags: [String!]
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