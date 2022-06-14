import { gql } from "apollo-server";

export default gql`
extend type Mutation {
  newProjectInvite(input: NewProjectInviteInput!): ID!
  acceptProjectInvite(inviteId: ID!): Boolean
  deleteProjectInvite(inviteId: ID!): Boolean
  joinOpenProject(projectId: ID!): Boolean
  test: Boolean
}

extend type Subscription {
  test(filter: TestSubscriptionFilter): TestSubscriptionPayload 
  inviteCreated(filter: ProjectInviteSubscriptionFilter!): ProjectInvite!
  inviteDeleted(filter: ProjectInviteSubscriptionFilter!): ProjectInvite!
}

input TestSubscriptionFilter {
  id: String
  someField: String
}

type TestSubscriptionPayload {
  joe: String
  mama: String
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