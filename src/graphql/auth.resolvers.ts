import { ApolloResolversContext } from '@src/context';
import { userToSecurityContext } from '@src/controllers/auth.controller';
import { SecurityContext } from '@src/controllers/entity-manager.controller';
import { QueryResolvers, MutationResolvers } from '@src/generated/graphql-endpoint.types';

function securityContextToGraphQLSecurityContext(securityContext: SecurityContext) {
  const gqlSecurityContext = JSON.parse(JSON.stringify(securityContext));
  const anySecurityContext = <any>gqlSecurityContext;
  for (const key in anySecurityContext) {
    const permissionDomains = anySecurityContext[key];
    if (typeof permissionDomains === 'boolean') {
      anySecurityContext[key] = {
        boolean: permissionDomains
      }
    } else {
      for (const key in anySecurityContext.domains) {
        const domain = anySecurityContext.domains[key];
        for (const key in domain) {
          const permissionOperationDomain = domain[key];
          if (typeof permissionOperationDomain === 'boolean') {
            // Boolean
            domain[key] = {
              boolean: permissionOperationDomain
            }
          }
          // Else JSON
        } 
      }
    }
  }
  return gqlSecurityContext;
}

export default {
  Query: {
    getSecurityContext: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext && 
        args.userId && 
        context.authUserId && 
        args.userId !== context.authUserId
      ) {
        // If we are querying for the security context of a another user,
        // then we must generate it, because we cannot reuse the security
        // context generated for ourselves.
        return securityContextToGraphQLSecurityContext(await userToSecurityContext(context.entityManager, context.authUserId));
      }
      if (context.securityContext)
        return securityContextToGraphQLSecurityContext(context.securityContext);
      return null;
    }
  },
  Mutation: {
    
  },
  PermissionDomains: {
    __resolveType(obj: any, context: ApolloResolversContext, info: any) {
      if (obj.boolean) {
        return 'Boolean';
      }
      if (obj.domains) {
        return 
      }
      return null;
    }
  },
  PermissionOperationDomain: {
    __resolveType(obj: any, context: ApolloResolversContext, info: any) {
      if (obj.name) {}
    }
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };