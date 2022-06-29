import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    requestProjectDiscordConfig(projectId: ID!): Boolean
    requestArchiveProjectDiscordConfig(projectId: ID!): Boolean
  }

  extend type Subscription {
    projectDiscordConfigRequested(filter: ProjectSubscriptionFilter!): ID
    archiveProjectDiscordConfigRequested(filter: ProjectSubscriptionFilter!): ID
  }
`;
