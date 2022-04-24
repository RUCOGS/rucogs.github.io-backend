// Load Environment variables
import dotenv from 'dotenv';

// Server
import express from 'express';
import cors from 'cors';

// Configure other routes.
//
// Unfortunately in typescript we we cannot use a single line
// notation like "require('auth.routes')(app);" to mport and
// immediately call the route setup function after its imported.
// Import statements in typescript must stand alone, therefore
// we need two lines to import and run the function.
import authRouter from './app/routes/auth.routes';
import userRouter from './app/routes/users.routes';

import passport from 'passport';
import initPassport from '@init/init-passport';

// Database Connection
import * as db from './app/models';
import { Config as DBConfig } from './app/config/db.config';
import { ConnectOptions } from 'mongoose';

import initRoles from '@init/init-roles';

dotenv.config();
const app = express();

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

initPassport(passport);
app.use(passport.initialize());
// We are using JWTs instead of sessions in order
// to avoid having to store session data on the server.
// app.use(passport.session());

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to atlinx application.' });
});

app.use('/auth', authRouter);
app.use('/users', userRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
  .connect(`mongodb://${DBConfig.USER}:${DBConfig.PASS}@${DBConfig.HOST}:${DBConfig.PORT}/${DBConfig.NAME}?authSource=admin&w=1`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
  .then(
    () => {
      console.log('Successfully connect to MongoDB.');
      initial();
    }
  )
  .catch(err => {
    console.error('Connection error', err);
    process.exit();
  });

// Called when everything is set up
function initial(): void {
  void initRoles();
}
