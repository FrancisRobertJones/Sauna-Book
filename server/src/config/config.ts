import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sauna-booking',
  nodeEnv: process.env.NODE_ENV || 'development'
};