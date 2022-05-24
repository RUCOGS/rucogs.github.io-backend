import { MongoClient } from 'mongodb';
import { resolvers } from '@src/generated/resolvers'
import { mergeTypeDefs } from '@graphql-tools/merge'
import inputTypeDefs from '@src/generated/operations'
import schemaTypeDefs from '@src/schema.typedefs'
import { AbstractDAO, FindOneParams, PERMISSION, typeDefs as typettaDirectivesTypeDefs } from '@twinlogix/typetta'
import { EntityManager } from '@src/generated/typetta'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRouter from '@src/routes/auth.routes';
import http from 'http';
import { createSecureEntityManager, createUnsecureEntityManager } from '@src/config/entity-manager.configurer';
import { authenticateAuthToken, configPassport, userToSecurityContext } from '@src/controllers/auth.controller';

async function startServer() {
  require('dotenv').config();
  const mongoClient = new MongoClient(process.env.MONGODB_URL!);
  const mongoDb = mongoClient.db(process.env.MONGODB_DATABASE_NAME);

  await mongoClient.connect();

  const unsecuredEntityManager = createUnsecureEntityManager(mongoDb);

  const app = express();
  const httpServer = http.createServer(app);
  configExpress(app, unsecuredEntityManager);
  
  const server = new ApolloServer({
    typeDefs: mergeTypeDefs([
      inputTypeDefs,
      schemaTypeDefs,
      typettaDirectivesTypeDefs,
    ]),
    resolvers,
    context: async ({ req }) => {
      const authPayload = await authenticateAuthToken(req);
      const securityContext = await userToSecurityContext(unsecuredEntityManager, authPayload.userId);
      return {
        securedEntityManager: createSecureEntityManager(securityContext, mongoDb)
      };
    },
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });

  // Set port, listen for requests
  const port = process.env.PORT || 3000;
  // Promisfy httpServer.listen();
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(
    `\
🚀 Server ready at: http://localhost:${port}
📈 GraphQL API ready at: http://localhost:${port}${server.graphqlPath}`,
  );
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