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
import { createSecureEntityManager, createUnsecureEntityManager, getOperationMetadataFromRequest } from '@src/controllers/entity-manager/entity-manager';
import { authenticate, AuthScheme, configPassport } from '@src/controllers/auth.controller';
import { getCompleteSecurityContext } from '@src/controllers/security';
import { Db } from 'mongodb';
import ServerConfig from '@src/config/server.config.json';
import { ApolloResolversContext, RequestWithDefaultContext } from '@src/misc/context';
import { typeDefs, resolvers } from '@src/controllers/entity-manager/typedefs-resolvers';


async function startServer(debug: boolean) {
  const mongoClient = new MongoClient(ServerConfig.mongodbUrl);
  const mongoDb = mongoClient.db(ServerConfig.mongodbDbName);

  await mongoClient.connect();

  const unsecuredEntityManager = createUnsecureEntityManager(mongoDb);
  
  const app = express();
  configExpress(app, unsecuredEntityManager);

  const httpServer = http.createServer(app);

  startApolloServer(app, mongoDb, ServerConfig.baseUrl + "/api/graphql", {
    debug,
    csrfPrevention: true,
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Set port, listen for requests
  const port = ServerConfig.port;
  // Promisfy httpServer.listen();
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  
  console.log(
    `\
🚀 Server ready at: http://localhost:${port}`,
  );  
}

async function startApolloServer(app: express.Application, mongoDb: Db, endpointPath: string, apolloConfig: Config<ExpressContext>, securityEnabled: boolean = true) {
  const server = new ExpressApolloServer({
    ...apolloConfig,
    context: async ({ req }): Promise<ApolloResolversContext> => {
      if (securityEnabled) {
        const authenticated = await authenticate(req);
        if (authenticated) {
          const [authScheme, authPayload] = authenticated;
          switch (authScheme) {
            case AuthScheme.BasicRoot: {
              const entityManager = createUnsecureEntityManager(mongoDb);
              return {
                entityManager,
              };
            }
            case AuthScheme.Bearer:
            default: {
              const securityContext = await getCompleteSecurityContext(createUnsecureEntityManager(mongoDb), authPayload.userId);
              const metadata = getOperationMetadataFromRequest(req);
              const entityManager = createSecureEntityManager(securityContext, mongoDb, metadata);
              return {
                entityManager,
                securityContext,
                authUserId: authPayload.userId,
              };
            }
          }
        } else {
          // Fallback to public api
          const securityContext = {};
          const entityManager = createSecureEntityManager(securityContext, mongoDb);
          return {
            entityManager,
            securityContext
          }
        }
      } else {
        return {
          entityManager: createUnsecureEntityManager(mongoDb)
        };
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: endpointPath });

  console.log(
    `\
📈 GraphQL API ready at: ${server.graphqlPath}`,
  );  
}

function configExpress(app: Express, entityManager: EntityManager) {
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
      entityManager
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

// Parse command line arguments
const args = process.argv.slice(2);
switch (args[0]) {
  case "debug":
    startServer(true);
    break;
  case "production":
  default:
    startServer(false);
    break;
}