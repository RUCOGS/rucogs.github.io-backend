import { ApolloResolversContext } from '@src/misc/context';
import { SecurityPolicies, getUserSecurityContext } from '@src/controllers/perms.controller';
import { QueryResolvers, MutationResolvers } from '@src/generated/graphql-endpoint.types';

export default {
  Query: {
    securityContext: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext && 
        args.userId && 
        context.authUserId && 
        args.userId !== context.authUserId
      ) {
        // If we are querying for the security context of a another user,
        // then we must generate it, because we cannot reuse the security
        // context generated for ourselves.
        return await getUserSecurityContext(context.entityManager, context.authUserId);
      }
      if (context.securityContext)
        return context.securityContext;
      return null;
    },
    securityPolicies: async (parent, args, context: ApolloResolversContext, info) => {
      return SecurityPolicies;
    }
  },
  Mutation: {
    
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };