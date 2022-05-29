
import { resolvers as generatedResolvers } from '@src/generated/resolvers'
import { mergeTypeDefs } from '@graphql-tools/merge'
import inputTypeDefs from '@src/generated/operations'
import schemaTypeDefs from '@src/graphql/schema.typedefs'
import { AbstractDAO, FindOneParams, PERMISSION, typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta'
import { resolvers as customResolvers } from './controllers/custom-resolvers.controller';
import authTypeDefs from '@src/graphql/auth.typedefs';
import authResolvers from '@src/graphql/auth.resolvers';

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
