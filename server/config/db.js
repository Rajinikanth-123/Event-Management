const mongoose = require('mongoose');

let dbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    dbConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    dbConnected = false;
    return false;
  }
};

const isDBConnected = () => dbConnected;

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;