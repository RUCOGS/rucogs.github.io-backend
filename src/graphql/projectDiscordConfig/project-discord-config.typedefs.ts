import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    projectDiscordConfigFromTextChannel(input: NewProjectInput!): ID!
  }
`;

// TODO NOW: Make special endpoint in backend for finding discordConfig based on textChannelId
