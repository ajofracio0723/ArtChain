import { MongoClient } from 'mongodb';

// Connection string from your MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://authentithief:authentithief@authentithief.wkpkta.mongodb.net/?retryWrites=true&w=majority&appName=authentithief';
const DB_NAME = 'artchain';

// Global variable to cache the MongoDB client connection
let cachedClient = null;
let cachedDb = null;

/**
 * Connect to MongoDB and return the database instance
 */
export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new MongoDB client connection
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Get the database instance
  const db = client.db(DB_NAME);

  // Cache the client and db connections
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}