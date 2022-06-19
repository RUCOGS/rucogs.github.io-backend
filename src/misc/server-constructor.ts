import ServerConfig from '@src/config/server.config.json';
import { authenticate, AuthScheme, configPassport } from '@src/controllers/auth.controller';
import { UPLOAD_DIRECTORY } from '@src/controllers/cdn.controller';
import { createSecureEntityManager, createUnsecureEntityManager, getOperationMetadataFromRequest } from '@src/controllers/entity-manager.controller/entity-manager';
import { getCompleteSecurityContext } from '@src/controllers/security.controller';
import { EntityManager } from '@src/generated/typetta';
import { schema } from '@src/graphql';
import { ApolloResolversContext, RequestWithDefaultContext } from '@src/misc/context';
import authRouter from '@src/routes/auth.routes';
import { DefaultSecurityContext } from '@src/shared/security';
import { ApolloServerPluginDrainHttpServer, Config } from 'apollo-server-core';
import { ApolloServer as ExpressApolloServer, ExpressContext } from 'apollo-server-express';
import cors from 'cors';
import express, { Express } from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import https from 'https';
import { Db, MongoClient } from 'mongodb';
import passport from 'passport';
import { WebSocketServer } from 'ws';

export async function startServer(debug: boolean, mock: boolean = false) {
  const mongoClient = new MongoClient(ServerConfig.mongodbUrl);
  const mongoDb = mock ? "mock" : mongoClient.db(ServerConfig.mongodbDbName);

  await mongoClient.connect();

  const unsecuredEntityManager = createUnsecureEntityManager(mongoDb);
  
  const app = express();
  configExpress(app, unsecuredEntityManager, mongoClient);

  let httpServer: http.Server | https.Server;
  if (debug)
    httpServer = http.createServer(app);
  else
    httpServer = https.createServer(app);

  startApolloServer(
    httpServer,
    app, 
    mongoDb, 
    ServerConfig.baseUrl + "/api/graphql", 
    unsecuredEntityManager,
    mongoClient,
    {
      debug,
      csrfPrevention: true,
      schema,
    }
  );
  // Set port, listen for requests
  const port = ServerConfig.port;
  // Promisfy httpServer.listen();
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  
  console.log(
    `\
🚀 Server ready at: ${debug ? 'http' : 'https' }://localhost:${port}`,
  );  
}

async function startApolloServer(httpServer: http.Server | https.Server, app: express.Application, mongoDb: Db | "mock", endpointPath: string, unsecureEntityManager: EntityManager, mongoClient: MongoClient, apolloConfig: Config<ExpressContext>) {
  async function authenticateGetContext(req: any) {
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
  }
  
  // Create websocket server for Apollo GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: endpointPath
  })
  const serverCleanup = useServer({ 
    schema: schema,
    onConnect: async (ctx) => {
      console.log(`Subscription Connected: ${ctx.subscriptions}`);
    },
    onDisconnect(ctx, code, reason) {
      console.log(`Subscription Disconnected: (${code}) "${reason}"`);
    },
    context: async(ctx, msg, args) => {
      console.log("Context: " + ctx);
      const context = await authenticateGetContext(ctx.connectionParams);
      return context;
    }
  }, wsServer);

  const server = new ExpressApolloServer({
    ...apolloConfig,    
    plugins: [
      // Shutdown for HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Shutdown for subscriptions WebSocket server. 
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          }
        }
      }
    ],
    context: async ({ req }): Promise<ApolloResolversContext> => {
      return await authenticateGetContext(req);
    },
  });

  await server.start();

  app.use(graphqlUploadExpress({ 
    maxFileSize: 1_000_000 * 100, // 100mb
    maxFiles: 10 
  }));
  server.applyMiddleware({ 
    app, 
    path: endpointPath
  });

  console.log(
    `\
📈 GraphQL API ready at: ${server.graphqlPath}`,
  );  
}

function configExpress(app: Express, entityManager: EntityManager, mongoClient: MongoClient) {
  // ----- CORS ----- //
  // Enable CORS for a specific origin
  app.use(cors({
    origin: "https://cogs.club"
  }));

  // TODO: Remove in production builds
  // Enable CORS for any origin
  // app.use(cors());

  // ----- PASSPORT ----- //
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
  router.use('/cdn/', express.static(UPLOAD_DIRECTORY))

  router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the RUCOGS backend API!' });
  });
  
  app.use(ServerConfig.baseUrl, router);
}