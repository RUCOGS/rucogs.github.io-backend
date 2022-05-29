import { AnyEntityManager } from "@src/controllers/entity-manager.controller";
import { SecurityContext } from "@src/shared/security.types";
import express from "express";

export type ApolloResolversContext = {
  entityManager: AnyEntityManager
  securityContext?: SecurityContext;
  authUserId?: string;
};
export type RequestContext = {
  entityManager: AnyEntityManager
  securityContext?: SecurityContext;
};

// The type enriching the Request type with the context field
export type HasContext<TContext> = {
  context: TContext
}

export type RequestWithDefaultContext = express.Request & Partial<HasContext<RequestContext>>;
export type RequestWithContext<TContext> = express.Request & Partial<HasContext<TContext>>;