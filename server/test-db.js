const mongoose = require('mongoose');
require('dotenv').config();

const testDatabaseConnection = async () => {
  try {
    console.log('🔄 Testing database connection...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'URI loaded from .env' : 'URI not found');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Database connection successful!');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    console.log('🌐 Connection host:', mongoose.connection.host);
    console.log('🔌 Connection port:', mongoose.connection.port);
    console.log('📈 Ready state:', mongoose.connection.readyState); // 1 = connected
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }
};

// Run the test
testDatabaseConnection(); 