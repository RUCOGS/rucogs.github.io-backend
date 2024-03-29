import { FuncQueue } from '@src/utils';
import { PubSub } from 'graphql-subscriptions';

export const PubSubEvents = {
  EBoardCreated: 'EBOARD_CREATED',
  EBoardUpdated: 'EBOARD_UPDATED',
  EBoardDeleted: 'EBOARD_DELETED',

  EBoardTermCreated: 'EBOARD_TERM_CREATED',
  EBoardTermUpdated: 'EBOARD_TERM_UPDATED',
  EBoardTermDeleted: 'EBOARD_TERM_DELETED',

  ProjectCreated: 'PROJECT_CREATED',
  ProjectUpdated: 'PROJECT_UPDATED',
  ProjectDeleted: 'PROJECT_DELETED',

  ProjectInviteDeleted: 'PROJECT_INVITE_DELETED',
  ProjectInviteCreated: 'PROJECT_INVITE_CREATED',

  ProjectMemberCreated: 'PROJECT_MEMBER_CREATED',
  ProjectMemberUpdated: 'PROJECT_MEMBER_UPDATED',
  ProjectMemberDeleted: 'PROJECT_MEMBER_DELETED',

  UserCreated: 'USER_CREATED',
  UserUpdated: 'USER_UPDATED',
  UserDeleted: 'USER_DELETED',

  UserLoginIdentityCreated: 'USER_LOGIN_IDENTITY_CREATED',
  UserLoginIdentityUpdated: 'USER_LOGIN_IDENTITY_UPDATED',
  UserLoginIdentityDeleted: 'USER_LOGIN_IDENTITY_DELETED',
} as const;
export type PubSubEvents = typeof PubSubEvents[keyof typeof PubSubEvents];

export class CustomPupSub extends PubSub {
  publishOrAddToFuncQueue(triggerName: string, payload: any, funcQueue: FuncQueue | undefined) {
    const publishFunc = () => this.publish(triggerName, payload);
    if (funcQueue) funcQueue.addFunc(publishFunc);
    else publishFunc();
  }
}

export const pubsub = new CustomPupSub();
export default pubsub;
