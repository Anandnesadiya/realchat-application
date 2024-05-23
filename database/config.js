// mongoConfig.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/ChatApp'; // Replace 'mydatabase' with your database name

let _db;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    _db = client.db(); 
    console.log("Connected to db")
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

function getDb() {
  if (!_db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return _db;
}

module.exports = {
  connectToDatabase,
  getDb
};
