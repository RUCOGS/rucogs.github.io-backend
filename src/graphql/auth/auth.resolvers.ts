import { ApolloResolversContext } from '@src/misc/context';
import { getCompleteSecurityContext } from '@src/controllers/security.controller';
import { QueryResolvers, MutationResolvers } from '@src/generated/graphql-endpoint.types';
import { SecurityPolicy } from '@src/controllers/security.controller';

export default {
  Query: {
    securityContext: async (parent, args, context: ApolloResolversContext, info) => {
      if ( 
        args.userId && 
        context.securityContext &&
        context.securityContext.userId &&
        args.userId !== context.securityContext.userId
      ) {
        // If we are querying for the security context of a another user,
        // then we must generate it, because we cannot reuse the security
        // context generated for ourselves.
        return await getCompleteSecurityContext(context.entityManager, context.securityContext.userId);
      }
      if (context.securityContext)
        return context.securityContext;
      return null;
    },
    securityPolicies: async (parent, args, context: ApolloResolversContext, info) => {
      return SecurityPolicy;
    }
  },
  Mutation: {
    
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };