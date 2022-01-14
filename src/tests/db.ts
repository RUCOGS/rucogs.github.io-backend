import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConnectionOptions } from 'tls';

const mongod = new MongoMemoryServer();

// MongoMemoryServer is as mongodb that runs in
// your computers memory. It automatically shuts down
// when our tests terminates.
//
// This lets us perform unit tests without having to
// manually spin up a testing DB on our computer.

// Connect to the DB
export async function connect(): Promise<void> {
  await mongod.start();
  const uri = await mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectionOptions);
}

// Disconnection from the DB
export async function closeDatabase(): Promise<void> {
  await mongoose.connection.dropDatabase();
  // await mongoose.connection.close();
  await mongod.stop();
}

// Clear all data from the DB
export async function clearDatabase(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}
