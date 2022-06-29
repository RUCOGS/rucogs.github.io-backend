import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    newProjectInvite(input: NewProjectInviteInput!): ID
    acceptProjectInvite(inviteId: ID!): Boolean
    deleteProjectInvite(inviteId: ID!): Boolean
    joinOpenProject(projectId: ID!): Boolean
  }

  extend type Subscription {
    projectInviteCreated(filter: ProjectInviteSubscriptionFilter!): ID
    projectInviteDeleted(filter: ProjectInviteSubscriptionFilter!): ID
  }

  input ProjectInviteSubscriptionFilter {
    projectId: ID
    userId: ID
  }

  input NewProjectInviteInput {
    type: InviteType!
    userId: ID!
    projectId: ID!
  }
`;
