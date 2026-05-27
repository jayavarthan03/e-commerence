import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    
    // Set connection options
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(connStr);
    
    console.log(`\x1b[32m%s\x1b[0m`, `✔ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✖ MongoDB Connection Error: ${error.message}`);
    console.log(`\x1b[33m%s\x1b[0m`, `💡 Tip: Please ensure MongoDB is installed and running locally, or specify a valid MONGO_URI in your .env file.`);
    console.log(`\x1b[36m%s\x1b[0m`, `🔄 Starting in Fallback Mode: Database modifications will only be simulated in memory unless MongoDB is connected.`);
    
    // We will let the app run by mocking the connection state internally if needed,
    // but we can also let mongoose connect or handle errors gracefully in controllers.
    return false;
  }
};

export default connectDB;
