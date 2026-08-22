const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/dayflow',
  JWT_SECRET: process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_hackathon_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || process.env.AI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};

module.exports = env;
