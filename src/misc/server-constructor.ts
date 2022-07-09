import { authenticate, AuthScheme, configPassport } from '@src/controllers/auth.controller';
import {
  createSecureEntityManager,
  createUnsecureEntityManager,
  getOperationMetadataFromRequest,
} from '@src/controllers/entity-manager.controller/entity-manager';
import { MailController } from '@src/controllers/mail.controller/mail.controller';
import { getCompleteSecurityContext } from '@src/controllers/security.controller';
import { EntityManager } from '@src/generated/typetta';
import { schema } from '@src/graphql';
import { ApolloResolversContext, RequestWithDefaultContext } from '@src/misc/context';
import authRouter from '@src/routes/auth.routes';
import cdnRouter from '@src/routes/cdn.routes';
import { DefaultSecurityContext } from '@src/shared/security';
import { ApolloServerPluginDrainHttpServer, Config } from 'apollo-server-core';
import { ApolloServer as ExpressApolloServer, ExpressContext } from 'apollo-server-express';
import cors from 'cors';
import express, { Express } from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { Db, MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { WebSocketServer } from 'ws';

export type ServerConfig = Omit<typeof import('@src/config/server.config.json'), 'nodemailer'> & { nodemailer: any };

let globalDebug = false;
export function isDebug() {
  return globalDebug;
}

export async function startServer(debug: boolean, mock: boolean = false) {
  const serverConfig: ServerConfig = debug
    ? await import('@src/config/server.debug.config.json')
    : await import('@src/config/server.config.json');

  globalDebug = debug;
  const mongoClient = new MongoClient(serverConfig.mongoDB.url);
  const mongoDb = mock ? 'mock' : mongoClient.db(serverConfig.mongoDB.dbName);

  await mongoClient.connect();

  const unsecureEntityManager = createUnsecureEntityManager(mongoDb);

  const nodemailerTransporter = nodemailer.createTransport({
    ...serverConfig.nodemailer,
    logger: true,
  });
  const mailController = new MailController(nodemailerTransporter);

  const app = express();
  configExpress({
    serverConfig,
    app,
    entityManager: unsecureEntityManager,
    mongoClient,
    debug,
  });

  const httpServer = http.createServer(app);

  startApolloServer({
    serverConfig,
    httpServer,
    app,
    mongoDb,
    endpointPath: serverConfig.baseUrl + '/graphql',
    unsecureEntityManager,
    mongoClient,
    mailController,
    apolloConfig: {
      debug,
      csrfPrevention: true,
      schema,
    },
  });

  // Set port, listen for requests
  const port = serverConfig.port;
  // Promisfy httpServer.listen();
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(
    `\
🚀 Server ready at: http://localhost:${port}`,
  );

  return {
    mongoClient,
    mongoDb,
    unsecuredEntityManager: unsecureEntityManager,
    app,
    httpServer,
  };
}

async function startApolloServer(options: {
  serverConfig: ServerConfig;
  httpServer: http.Server;
  app: express.Application;
  mongoDb: Db | 'mock';
  endpointPath: string;
  unsecureEntityManager: EntityManager;
  mongoClient: MongoClient;
  mailController: MailController;
  apolloConfig: Config<ExpressContext>;
}) {
  async function authenticateGetContext(req: any): Promise<ApolloResolversContext> {
    const authenticated = await authenticate(req);
    if (authenticated) {
      const [authScheme, authPayload] = authenticated;
      switch (authScheme) {
        case AuthScheme.BasicRoot: {
          return {
            entityManager: options.unsecureEntityManager,
            unsecureEntityManager: options.unsecureEntityManager,
            mongoClient: options.mongoClient,
            securityContext: DefaultSecurityContext,
            mailController: options.mailController,
            serverConfig: options.serverConfig,
          };
        }
        case AuthScheme.Bearer:
        default: {
          const securityContext = await getCompleteSecurityContext(
            createUnsecureEntityManager(options.mongoDb),
            authPayload.userId,
          );
          const metadata = getOperationMetadataFromRequest(req);
          const entityManager = createSecureEntityManager(securityContext, options.mongoDb, metadata);
          return {
            entityManager,
            unsecureEntityManager: options.unsecureEntityManager,
            securityContext,
            mongoClient: options.mongoClient,
            mailController: options.mailController,
            serverConfig: options.serverConfig,
          };
        }
      }
    } else {
      // Fallback to public api
      const entityManager = createSecureEntityManager(DefaultSecurityContext, options.mongoDb);
      return {
        entityManager,
        unsecureEntityManager: options.unsecureEntityManager,
        securityContext: DefaultSecurityContext,
        mongoClient: options.mongoClient,
        mailController: options.mailController,
        serverConfig: options.serverConfig,
      };
    }
  }

  // Create websocket server for Apollo GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: options.httpServer,
    path: options.endpointPath,
  });
  const serverCleanup = useServer(
    {
      schema: schema,
      onConnect: async (ctx) => {
        console.log(`Subscription Connected: ${ctx.subscriptions}`);
      },
      onDisconnect(ctx, code, reason) {
        console.log(`Subscription Disconnected: (${code}) "${reason}"`);
      },
      context: async (ctx, msg, args) => {
        console.log('Context: ' + ctx);
        const context = await authenticateGetContext(ctx.connectionParams);
        return context;
      },
    },
    wsServer,
  );

  const server = new ExpressApolloServer({
    ...options.apolloConfig,
    plugins: [
      // Shutdown for HTTP server.
      ApolloServerPluginDrainHttpServer({
        httpServer: options.httpServer,
      }),
      // Shutdown for subscriptions WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: async ({ req }): Promise<ApolloResolversContext> => {
      return await authenticateGetContext(req);
    },
  });

  await server.start();

  options.app.use(
    graphqlUploadExpress({
      maxFileSize: 1_000_000 * 100, // 100mb
      maxFiles: 10,
    }),
  );
  server.applyMiddleware({
    app: options.app,
    path: options.endpointPath,
  });

  console.log(
    `\
📈 GraphQL API ready at: ${server.graphqlPath}`,
  );
}

function configExpress(options: {
  serverConfig: ServerConfig;
  app: Express;
  entityManager: EntityManager;
  mongoClient: MongoClient;
  debug: boolean;
}) {
  // ----- CORS ----- //
  // Enable CORS for a specific origin
  if (options.debug) {
    options.app.use(cors());
  } else {
    options.app.use(
      cors({
        origin: ['https://cogs.club', 'https://atlinx.net'],
      }),
    );
  }

  // ----- PASSPORT ----- //
  configPassport(passport, options.entityManager);
  options.app.use(passport.initialize());

  // We are using JWTs instead of sessions in order
  // to avoid having to store session data on the server.
  // app.use(passport.session());

  // ----- REQUEST CONTEXT ----- //
  // We need to inject a context into `req` so we
  // can use it in any of our requests.
  options.app.use((req: RequestWithDefaultContext, res, next) => {
    req.context = {
      unsecureEntityManager: options.entityManager,
      mongoClient: options.mongoClient,
      serverConfig: options.serverConfig,
    };
    next();
  });

  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/cdn', cdnRouter);

  router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the RUCOGS backend API!' });
  });

  options.app.use(options.serverConfig.baseUrl, router);
}
