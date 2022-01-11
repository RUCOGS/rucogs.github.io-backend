/* eslint-disable import/first */

// Load Environment variables
import dotenv from 'dotenv';
dotenv.config();

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
import userRouter from './app/routes/user.routes';

import passport from 'passport';

import initPassport from './app/middlewares/init-passport';
initPassport(passport);

// Database Connection
import * as db from './app/models';
import { Config as DBConfig } from './app/config/db.config';
import { ConnectOptions, NativeError } from 'mongoose';

const app = express();

const corsOptions = {
  origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
// We are using JWTs instead of sessions in order
// to avoid having to store session data on the server.
// app.use(passport.session());

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to atlinx application.' });
});

app.use('/auth', authRouter);
app.use('/user', userRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const Role = db.RoleModel;

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

function initial(): void {
  void Role.estimatedDocumentCount({}, (err: NativeError, count: number) => {
    if (!err) {
      if (count === 0) {
        new Role({
          name: 'user'
        }).save(err => {
          if (err) {
            console.log('error', err);
          }

          console.log("added 'user' to roles collection");
        });

        new Role({
          name: 'moderator'
        }).save(err => {
          if (err) {
            console.log('error', err);
          }

          console.log("added 'moderator' to roles collection");
        });

        new Role({
          name: 'admin'
        }).save(err => {
          if (err) {
            console.log('error', err);
          }

          console.log("added 'admin' to roles collection");
        });
      }
    } else {
      console.error('Error in initializing DB', err);
      process.exit();
    }
  });
}
