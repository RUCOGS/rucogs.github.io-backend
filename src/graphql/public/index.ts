import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import inputTypeDefs from '@src/generated/operations';
import { resolvers as generatedResolvers } from '@src/generated/resolvers';
import customTypeDefs from '@src/graphql/shared/custom.typedefs';
import scalarResolvers from '@src/graphql/shared/scalar.resolvers';
import schemaTypeDefs from '@src/graphql/shared/schema.typedefs';
import { typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta';
import { GraphQLUpload } from 'graphql-upload';
import { mergeResolvers } from '../utils/utils';
import authResolvers from './auth/auth.resolvers';
import authTypeDefs from './auth/auth.typedefs';
import eBoardResolvers from './e-board/e-board.resolvers';
import eBoardTypeDefs from './e-board/e-board.typedefs';
import projectDiscordSettingsResolvers from './project-discord-config/project-discord-config.resolvers';
import projectDiscordSettingsTypeDefs from './project-discord-config/project-discord-config.typedefs';
import projectInviteResolvers from './project-invite/project-invite.resolvers';
import projectInviteTypeDefs from './project-invite/project-invite.typedefs';
import projectMemberResolvers from './project-member/project-member.resolvers';
import projectMemberTypeDefs from './project-member/project-member.typedefs';
import projectResolvers from './project/project.resolvers';
import projectTypeDefs from './project/project.typedefs';
import userLoginIdentityResolvers from './user-login-identity/user-login-identity.resolvers';
import userLoginIdentityTypeDefs from './user-login-identity/user-login-identity.typedefs';
import userResolvers from './user/user.resolvers';
import userTypeDefs from './user/user.typedefs';

// CONFIG: Apollo GraphQL typdefs and resolvers
export const typeDefs = mergeTypeDefs([
  inputTypeDefs,
  schemaTypeDefs,
  typettaDirectivesTypeDefs,
  authTypeDefs,
  userTypeDefs,
  projectTypeDefs,
  projectInviteTypeDefs,
  projectMemberTypeDefs,
  customTypeDefs,
  projectTypeDefs,
  eBoardTypeDefs,
  projectDiscordSettingsTypeDefs,
  userLoginIdentityTypeDefs,
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
  userLoginIdentityResolvers,
  {
    Upload: GraphQLUpload,
  },
]);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
