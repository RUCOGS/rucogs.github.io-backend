import { ResolverFn as GQLSubscriptionResolverFn } from 'graphql-subscriptions'

export function toSubResolverFn(fn: GQLSubscriptionResolverFn) {
  return fn as any;
}

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
