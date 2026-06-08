const mongoose = require('mongoose');

let isConnected = null;

const connectDB = async () => {
  // If already connected, return the existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress, await it
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB: Connection is currently in progress...');
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
  
  // Mask the password for safe logging
  const maskedUri = uri.replace(/:([^@]+)@/, ':***@');
  console.log(`MongoDB: Attempting to connect to ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds (default is 30s)
      connectTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Check for common connection issues
    if (error.message.includes('authentication failed') || error.message.includes('auth')) {
      console.error('MongoDB Help: Please check your password/username in MONGO_URI.');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout') || error.message.includes('MongooseError')) {
      console.error('MongoDB Help: This connection is timing out. This is usually caused by MongoDB Atlas IP Whitelisting blocking Vercel. Please ensure you have added "0.0.0.0/0" (Allow Access from Anywhere) under Network Access in MongoDB Atlas.');
    }
    throw error;
  }
};

module.exports = connectDB;

