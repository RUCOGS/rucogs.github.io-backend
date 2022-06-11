
import { resolvers as generatedResolvers } from '@src/generated/resolvers'
import { mergeTypeDefs } from '@graphql-tools/merge'
import inputTypeDefs from '@src/generated/operations'
import schemaTypeDefs from './schema.typedefs'
import { typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta'
import scalarResolvers from './scalar.resolvers';
import authTypeDefs from './auth/auth.typedefs';
import authResolvers from './auth/auth.resolvers';
import projectTypedefs from './project/project.typedefs'
import projectResolvers from './project/project.resolvers'
import userTypedefs from './user/user.typedefs'
import userResolvers from './user/user.resolvers'
import customTypedefs from './custom.typedefs'
import projectInviteTypedefs from './project-invite/project-invite.typedefs'
import projectInviteResolvers from './project-invite/project-invite.resolvers'
import projectMemberResolvers from './project-member/project-member.resolvers'
import projectMemberTypedefs from './project-member/project-member.typedefs'
import eBoardTypedefs from './e-board/e-board.typedefs'
import eBoardResolvers from './e-board/e-board.resolvers'

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
]);

export function mergeResolvers(resolversArr: any[]) {
  let mergedResolvers = { Query: {}, Mutation: {}};
  for (const resolvers of resolversArr) {
    // Merge resolver for different types, and then
    // join the query and mutation resolvers together
    mergedResolvers = {
      ...mergedResolvers,
      ...resolvers,
      Query: {
        ...mergedResolvers.Query,
        ...resolvers.Query
      },
      Mutation: {
        ...mergedResolvers.Mutation,
        ...resolvers.Mutation
      }
    }
  }
  return mergedResolvers;
}
