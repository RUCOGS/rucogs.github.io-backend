
import { resolvers as generatedResolvers } from '@src/generated/resolvers'
import { mergeTypeDefs } from '@graphql-tools/merge'
import inputTypeDefs from '@src/generated/operations'
import schemaTypeDefs from './schema.typedefs'
import { typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta'
import customResolvers from './scalar.resolvers';
import authTypeDefs from './auth/auth.typedefs';
import authResolvers from './auth/auth.resolvers';

// CONFIG: Apollo GraphQL typdefs and resolvers
export const typeDefs = mergeTypeDefs([
  inputTypeDefs,
  schemaTypeDefs,
  typettaDirectivesTypeDefs,
  authTypeDefs,
]);

export const resolvers = mergeResolvers([
  generatedResolvers,
  authResolvers,
  customResolvers
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
