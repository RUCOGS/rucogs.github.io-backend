
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

// CONFIG: Apollo GraphQL typdefs and resolvers
export const typeDefs = mergeTypeDefs([
  inputTypeDefs,
  schemaTypeDefs,
  typettaDirectivesTypeDefs,
  authTypeDefs,
  userTypedefs,
  projectTypedefs
]);

export const resolvers = mergeResolvers([
  generatedResolvers,
  authResolvers,
  scalarResolvers,
  userResolvers,
  projectResolvers
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
