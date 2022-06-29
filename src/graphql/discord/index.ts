import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '../utils/utils';

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
  userLoginIdentityTypedefs,
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
