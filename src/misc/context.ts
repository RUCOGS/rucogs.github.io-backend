import { AnyEntityManager } from '@src/controllers/entity-manager.controller/entity-manager';
import { MailController } from '@src/controllers/mail.controller/mail.controller';
import { EntityManager } from '@src/generated/typetta';
import { SecurityContext } from '@src/shared/security';
import express from 'express';
import { MongoClient } from 'mongodb';
import { ServerConfig } from './server-constructor';

export type ApolloResolversContext = {
  entityManager: AnyEntityManager;
  unsecureEntityManager: EntityManager;
  mongoClient: MongoClient;
  securityContext: SecurityContext;
  mailController: MailController;
  serverConfig: ServerConfig;
};
export type RequestContext = {
  unsecureEntityManager: EntityManager;
  mongoClient: MongoClient;
  securityContext?: SecurityContext;
  serverConfig: ServerConfig;
};

// The type enriching the Request type with the context field
export type HasContext<TContext> = {
  context: TContext;
};

export type RequestWithDefaultContext = express.Request & Partial<HasContext<RequestContext>>;
export type RequestWithContext<TContext> = express.Request & Partial<HasContext<TContext>>;
