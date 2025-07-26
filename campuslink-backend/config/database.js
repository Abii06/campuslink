const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to Local MongoDB...');
    console.log(`🌐 URI: ${process.env.MONGODB_URI}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Optimized settings for local MongoDB
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000
    });
    
    console.log(`✅ Local MongoDB Connected Successfully!`);
    console.log(`🏠 Host: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    console.log(`📈 Collections: Will be created as needed`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    // Log when collections are created
    mongoose.connection.on('collection', (collection) => {
      console.log(`📁 Collection created: ${collection.name}`);
    });
    
    return conn;
  } catch (error) {
    console.error('❌ Local MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('🔍 Local MongoDB connection issues:');
      console.error('   1. Make sure MongoDB service is running');
      console.error('   2. Check if MongoDB is installed');
      console.error('   3. Verify MongoDB is running on port 27017');
      console.error('   4. Try: net start "MongoDB Server (MongoDB)"');
    }
    
    console.error('⚠️ Server will continue but database operations will fail');
    process.exit(1);
  }
};

module.exports = connectDB;