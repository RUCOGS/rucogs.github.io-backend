import { getCompleteSecurityContext, SecurityPolicy } from '@src/controllers/security.controller';
import { MutationResolvers, QueryResolvers } from '@src/generated/graphql-endpoint.types';
import { ApolloResolversContext } from '@src/misc/context';

export default {
  Query: {
    securityContext: async (parent, args, context: ApolloResolversContext, info) => {
      let clearCache: boolean = args.clearCache != undefined && args.clearCache;
      if (args.userId) {
        // If we are querying for the security context of a another user,
        // then we must generate it, because we cannot reuse the security
        // context generated for ourselves.

        // Security contexts queried here should always be up to date, therefore we must
        // regenerate it even if it was stored in the cache.
        return await getCompleteSecurityContext(context.unsecureEntityManager, args.userId, clearCache);
      }
      if (context.securityContext) {
        if (context.securityContext.userId) {
          return await getCompleteSecurityContext(context.unsecureEntityManager, context.securityContext.userId, clearCache);
        } else {
          return context.securityContext;
        }
      }
      return null;
    },
    securityPolicy: async (parent, args, context: ApolloResolversContext, info) => {
      return SecurityPolicy;
    },
  },
  Mutation: {},
} as { Query: QueryResolvers; Mutation: MutationResolvers };
