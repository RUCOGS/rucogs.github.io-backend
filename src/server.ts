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
import authRoute from './app/routes/auth.routes';
import userRoute from './app/routes/user.routes';

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

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RUCOGS backend.' });
}); authRoute(app); userRoute(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const Role = db.RoleModel;

db.mongoose
  .connect(`mongodb://${DBConfig.HOST}:${DBConfig.PORT}/${DBConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    initial();
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit();
  });

function initial(): void {
  void Role.estimatedDocumentCount({}, (err: NativeError, count: number) => {
    if (!err && count === 0) {
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
  });
}
