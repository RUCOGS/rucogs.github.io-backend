import { PubSub } from 'graphql-subscriptions';

export const GraphQLEvents = {
  InviteDeleted: "INVITE_DELETED",
  InviteCreated: "INVITE_CREATED"
}

export const pubsub = new PubSub();
export default pubsub;