// /lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  // Connect to the "test" database where your admins collection is located
  const dbName = 'test';
  console.log('Connecting to database:', dbName);
  
  const db = client.db(dbName);
  return { db, client };
}

// Add a default export that uses connectToDatabase
const connectDB = async () => {
  return await connectToDatabase();
};

export default connectDB;