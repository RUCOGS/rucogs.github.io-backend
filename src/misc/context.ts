import { AnyEntityManager } from "@src/controllers/entity-manager.controller/entity-manager";
import { EntityManager } from "@src/generated/typetta";
import { SecurityContext } from "@src/shared/security";
import express from "express";

export type ApolloResolversContext = {
  entityManager: AnyEntityManager
  securityContext?: SecurityContext
};
export type RequestContext = {
  unsecureEntityManager: EntityManager
  securityContext?: SecurityContext
};

// The type enriching the Request type with the context field
export type HasContext<TContext> = {
  context: TContext
}

export type RequestWithDefaultContext = express.Request & Partial<HasContext<RequestContext>>;
export type RequestWithContext<TContext> = express.Request & Partial<HasContext<TContext>>;