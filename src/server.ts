import { MongoClient } from 'mongodb';
import { resolvers as generatedResolvers } from '@src/generated/resolvers'
import { resolvers as customResolvers } from '@src/resolvers'
import { mergeTypeDefs } from '@graphql-tools/merge'
import inputTypeDefs from '@src/generated/operations'
import schemaTypeDefs from '@src/schema.typedefs'
import { AbstractDAO, FindOneParams, PERMISSION, typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta'
import { EntityManager } from '@src/generated/typetta'
import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { Express } from 'express';
import { ApolloServerPluginDrainHttpServer, Config } from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRouter from '@src/routes/auth.routes';
import http from 'http';
import { createSecureEntityManager, createUnsecureEntityManager, getOperationMetadataFromRequest } from '@src/config/entity-manager.configurer';
import { authenticate, authenticateBearerToken, authenticateBasicRootUserPassword, AuthScheme, configPassport, userToSecurityContext } from '@src/controllers/auth.controller';
import { Db } from 'mongodb';
import DbConfig from '@src/config/db.config.json';
import AuthConfig from '@src/config/auth.config.json';

async function startServer() {
  const mongoClient = new MongoClient(DbConfig.mongodbUrl);
  const mongoDb = mongoClient.db(DbConfig.mongodbDbName);

  await mongoClient.connect();

  const unsecuredEntityManager = createUnsecureEntityManager(mongoDb);
  
  const app = express();
  configExpress(app, unsecuredEntityManager);

  const httpServer = http.createServer(app);

  startApolloServer(app, httpServer, mongoDb, "/api/graphql", {});
  // Set port, listen for requests
  const port = process.env.PORT || 3000;
  // Promisfy httpServer.listen();
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  
  console.log(
    `\
🚀 Server ready at: http://localhost:${port}`,
  );  
}

async function startApolloServer(app: express.Application, httpServer: http.Server, mongoDb: Db, endpointPath: string, apolloConfig: Config<ExpressContext>) {
  const server = new ApolloServer({
    ...apolloConfig,
    typeDefs: mergeTypeDefs([
      inputTypeDefs,
      schemaTypeDefs,
      typettaDirectivesTypeDefs,
    ]),
    resolvers: mergeResolvers([
      generatedResolvers,
      customResolvers
    ]),
    context: async ({ req }) => {
      const [authScheme, authPayload] = await authenticate(req);
      switch (authScheme) {
        case AuthScheme.BasicRoot: {
          const entityManager = createUnsecureEntityManager(mongoDb);
          return {
            entityManager,
          };
        }
        case AuthScheme.Bearer: {
          const securityContext = await userToSecurityContext(createUnsecureEntityManager(mongoDb), authPayload.userId);
          const metadata = getOperationMetadataFromRequest(req);
          const entityManager = createSecureEntityManager(securityContext, mongoDb, metadata);
          return {
            entityManager,
          };
        }
        default:
          throw new Error("Unknown authScheme.");
      }
    },
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app, path: endpointPath });

    console.log(
    `\
📈 GraphQL API ready at: ${server.graphqlPath}`,
  );  
}

function mergeResolvers(resolversArr: any[]) {
  let mergedResolvers = { Query: {}, Mutation: {}};
  for (const resolvers of resolversArr) {
    mergedResolvers = {
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

function configExpress(app: Express, entityManager: EntityManager) {
  // ----- CORS ----- //
  // Enable CORS for a specific origin
  // const corsOptions = {
  //   origin: 'http://localhost:8081'
  // };
  //
  // app.use(cors(corsOptions));

  // TODO: Remove in production builds
  // Enable CORS for any origin
  app.use(cors());

  // TODO: Remove this if unecessary
  // parse requests of content-type - application/json
  // app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  // app.use(express.urlencoded({ extended: true }));

  // ----- PASSPORT ----- //
  // TODO: Add passport
  configPassport(passport, entityManager);
  app.use(passport.initialize());

  // We are using JWTs instead of sessions in order
  // to avoid having to store session data on the server.
  // app.use(passport.session());
  // Simple route

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the RUCOGS backend API!' });
  });

  app.use('/auth', authRouter);
}

startServer();