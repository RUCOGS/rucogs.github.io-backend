import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import inputTypeDefs from '@src/generated/operations';
import { resolvers as generatedResolvers } from '@src/generated/resolvers';
import { typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta';
import { GraphQLUpload } from 'graphql-upload';
import authResolvers from './auth/auth.resolvers';
import authTypeDefs from './auth/auth.typedefs';
import customTypedefs from './custom.typedefs';
import eBoardResolvers from './e-board/e-board.resolvers';
import eBoardTypedefs from './e-board/e-board.typedefs';
import projectDiscordSettingsResolvers from './project-discord-settings/project-discord-settings.resolvers';
import projectDiscordSettingsTypedefs from './project-discord-settings/project-discord-settings.typedefs';
import projectInviteResolvers from './project-invite/project-invite.resolvers';
import projectInviteTypedefs from './project-invite/project-invite.typedefs';
import projectMemberResolvers from './project-member/project-member.resolvers';
import projectMemberTypedefs from './project-member/project-member.typedefs';
import projectResolvers from './project/project.resolvers';
import projectTypedefs from './project/project.typedefs';
import scalarResolvers from './scalar.resolvers';
import schemaTypeDefs from './schema.typedefs';
import userResolvers from './user/user.resolvers';
import userTypedefs from './user/user.typedefs';
import { mergeResolvers } from './utils';

// CONFIG: Apollo GraphQL typdefs and resolvers
export const typeDefs = mergeTypeDefs([
  inputTypeDefs,
  schemaTypeDefs,
  typettaDirectivesTypeDefs,
  authTypeDefs,
  userTypedefs,
  projectTypedefs,
  projectInviteTypedefs,
  projectMemberTypedefs,
  customTypedefs,
  projectTypedefs,
  eBoardTypedefs,
  projectDiscordSettingsTypedefs,
]);

export const resolvers = mergeResolvers([
  generatedResolvers,
  authResolvers,
  userResolvers,
  scalarResolvers,
  projectResolvers,
  projectInviteResolvers,
  projectMemberResolvers,
  projectResolvers,
  eBoardResolvers,
  projectDiscordSettingsResolvers,
  {
    Upload: GraphQLUpload,
  },
]);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
