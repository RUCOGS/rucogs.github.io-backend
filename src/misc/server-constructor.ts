import { MongoClient } from 'mongodb';
import { EntityManager } from '@src/generated/typetta'
import { ApolloServer as ExpressApolloServer, ExpressContext } from 'apollo-server-express'
import { Express } from 'express';
import { ApolloServerPluginDrainHttpServer, Config } from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRouter from '@src/routes/auth.routes';
import fileUploadRouter from '@src/routes/upload.routes';
import http from 'http';
import { createSecureEntityManager, createUnsecureEntityManager, getOperationMetadataFromRequest } from '@src/controllers/entity-manager.controller/entity-manager';
import { authenticate, AuthScheme, configPassport } from '@src/controllers/auth.controller';
import { getCompleteSecurityContext } from '@src/controllers/security.controller';
import { Db } from 'mongodb';
import ServerConfig from '@src/config/server.config.json';
import { ApolloResolversContext, RequestWithDefaultContext } from '@src/misc/context';
import { typeDefs, resolvers } from '@src/graphql';
import { DefaultSecurityContext } from '@src/shared/security';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';


export async function startServer(debug: boolean, mock: boolean = false) {
  const mongoClient = new MongoClient(ServerConfig.mongodbUrl);
  const mongoDb = mock ? "mock" : mongoClient.db(ServerConfig.mongodbDbName);

  await mongoClient.connect();

  const unsecuredEntityManager = createUnsecureEntityManager(mongoDb);
  
  const app = express();
  configExpress(app, unsecuredEntityManager, mongoClient);

  const httpServer = http.createServer(app);

  startApolloServer(
    app, 
    mongoDb, 
    ServerConfig.baseUrl + "/api/graphql", 
    unsecuredEntityManager,
    mongoClient,
    {
      debug,
      csrfPrevention: true,
      typeDefs,
      resolvers: {
        Upload: GraphQLUpload,
        ...resolvers
      },
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    }
  );
  // Set port, listen for requests
  const port = ServerConfig.port;
  // Promisfy httpServer.listen();
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  
  console.log(
    `\
🚀 Server ready at: http://localhost:${port}`,
  );  
}

async function startApolloServer(app: express.Application, mongoDb: Db | "mock", endpointPath: string, unsecureEntityManager: EntityManager, mongoClient: MongoClient, apolloConfig: Config<ExpressContext>) {
  const server = new ExpressApolloServer({
    ...apolloConfig,
    context: async ({ req }): Promise<ApolloResolversContext> => {
      const authenticated = await authenticate(req);
      if (authenticated) {
        const [authScheme, authPayload] = authenticated;
        switch (authScheme) {
          case AuthScheme.BasicRoot: {
            return {
              entityManager: unsecureEntityManager,
              unsecureEntityManager,
              mongoClient,
              securityContext: DefaultSecurityContext,
            };
          }
          case AuthScheme.Bearer:
          default: {
            const securityContext = await getCompleteSecurityContext(createUnsecureEntityManager(mongoDb), authPayload.userId);
            const metadata = getOperationMetadataFromRequest(req);
            const entityManager = createSecureEntityManager(securityContext, mongoDb, metadata);
            return {
              entityManager,
              unsecureEntityManager,
              securityContext,
              mongoClient,
            };
          }
        }
      } else {
        // Fallback to public api
        const entityManager = createSecureEntityManager(DefaultSecurityContext, mongoDb);
        return {
          entityManager,
          unsecureEntityManager,
          securityContext: DefaultSecurityContext,
          mongoClient,
        }
      }
    },
  });

  await server.start();

  app.use(graphqlUploadExpress({ maxFileSize: 1000000 * 20, maxFiles: 10 }));

  server.applyMiddleware({ app, path: endpointPath });

  console.log(
    `\
📈 GraphQL API ready at: ${server.graphqlPath}`,
  );  
}

function configExpress(app: Express, entityManager: EntityManager, mongoClient: MongoClient) {
  // ----- CORS ----- //
  // Enable CORS for a specific origin
  // app.use(cors({
  //   origin: "http://localhost:8081"
  // }));

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
  
  // ----- REQUEST CONTEXT ----- //
  // We need to inject a context into `req` so we
  // can use it in any of our requests.
  app.use((req: RequestWithDefaultContext, res, next) => {
    req.context = {
      unsecureEntityManager: entityManager,
      mongoClient
    }
    next();
  })

  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/upload', fileUploadRouter);
  router.use('/cdn/', express.static("src/uploads"))

  router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the RUCOGS backend API!' });
  });
  
  app.use(ServerConfig.baseUrl, router);
}