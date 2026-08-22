const mongoose = require('mongoose');
const env = require('./env');

let mongod = null;

const connectDB = async () => {
  try {
    // Attempt standard connection to MONGO_URI with 5s timeout
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${env.MONGO_URI} (${error.message}).`);

    // In development/test, attempt to start MongoMemoryServer fallback if available
    if (env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Initializing MongoMemoryServer development fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri, { autoIndex: true });
        console.log(`[Database] In-Memory MongoDB Connected at ${uri}`);

        // Automatically seed data into in-memory instance
        const seedDatabase = require('../seed/seedData');
        console.log('[Database] Auto-seeding in-memory database with sample DayFlow records...');
        await seedDatabase();

        return conn;
      } catch (memErr) {
        console.error(`[Database] MongoMemoryServer fallback failed: ${memErr.message}`);
      }
    }

    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;

