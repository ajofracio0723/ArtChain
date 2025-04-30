// Create a new file: lib/mongodb.js (moved from pages/lib)

import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase(uri) {
  // Use existing connection if available
  if (cachedClient && cachedDb) {
    console.log("Using cached database connection");
    return { client: cachedClient, db: cachedDb };
  }

  // Determine which URI to use
  const connectionUri = uri || process.env.MONGODB_URI;
  
  if (!connectionUri) {
    throw new Error('MongoDB URI not provided. Please add your MongoDB URI to .env.local or pass it as a parameter');
  }

  try {
    // Log connection attempt
    console.log("Attempting to connect to MongoDB...");
    
    const client = await MongoClient.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Limiting connection pool for better performance
      connectTimeoutMS: 5000, // 5 seconds connection timeout
    });

    // Extract database name from URI
    let dbName;
    try {
      // Using regex instead of URL constructor for better compatibility
      const dbMatch = connectionUri.match(/\/([^/?]+)(\?|$)/);
      dbName = dbMatch ? dbMatch[1] : 'authentithief';
    } catch (urlError) {
      console.warn("Could not parse database name from URI:", urlError.message);
      dbName = 'authentithief'; // Fallback to default
    }
    
    const db = client.db(dbName || 'authentithief');
    
    console.log("Successfully connected to MongoDB database:", dbName || 'authentithief');
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

// Function to close the connection (useful for testing or when the app is shutting down)
export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
}