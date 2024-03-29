import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    projectCount: Int
  }

  extend type Mutation {
    newProject(input: NewProjectInput!): ID!
    updateProject(input: UpdateProjectInput!): Boolean
    deleteProject(id: ID!): Boolean
    transferProjectOwnership(projectId: ID!, memberId: ID!): Boolean
  }

  extend type Subscription {
    projectCreated(filter: ProjectSubscriptionFilter): Project
    projectUpdated(filter: ProjectSubscriptionFilter): Project
    projectDeleted(filter: ProjectSubscriptionFilter): Project
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
    galleryImages: [UploadOrSource!]
    soundcloudEmbedSrc: String
    downloadLinks: [String!]
    completed: Boolean

    createdAt: Date
    completedAt: Date
  }

  input NewProjectInput {
    name: String!
    pitch: String!
    access: Access!
  }
`;
