import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import * as db from '@tests/db';

dotenv.config();

type ConfigureApp = (app: Express) => void;
type OnReady = Promise<void>;

export const app = express();

export async function startServer(...configureAppFns: ConfigureApp[]): OnReady {
  // Enable CORS for any origin
  // const corsOptions = {
  //   origin: 'http://localhost:8081'
  // };
  //
  // app.use(cors(corsOptions));

  app.use(cors());

  // parse requests of content-type - application/json
  app.use(express.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // Configure the app
  // for ..of returns elements being iterated (The actual values of the arrays).
  // for ...in returns the keys being iterated (The indices 0, 1, 2, ... for arrays)
  for (const configureFn of configureAppFns) {
    configureFn(app);
  }

  // set port, listen for requests
  // const PORT = process.env.PORT || 8080;

  // const server = app.listen(PORT);

  // await once(server, 'listening');
  // console.log(`Server is running on port ${PORT}.`);

  await db.connect();
  console.log('Connected to memory MongoDB.');

  // return server;
};

export async function clearServer(): Promise<void> {
  await db.clearDatabase();
}

export async function closeServer(): Promise<void> {
  await db.closeDatabase();
}
