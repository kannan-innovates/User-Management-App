import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DATABASE CONNECTION SUCCESS');
  } catch (error) {
    console.error('DATABASE CONNECTION FAILED:', error.message);
    process.exit(1); 
  }
};

export default connectDB;