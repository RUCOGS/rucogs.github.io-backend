import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    requestProjectDiscord(projectId: ID!): Boolean
  }

  extend type Subscription {
    projectDiscordRequested(filter: ProjectSubscriptionFilter!): ID
  }
`;
