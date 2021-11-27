require('dotenv').config();

const DATABASE_CLIENT_URL = process.env.DATABASE_CLIENT_URL, // To connect with the database
  JWT_KEY = process.env.JWT_KEY, // For JWT token creation
  BBB_URL = process.env.BBB_URL, // To connect with the BBB server
  BBB_SECRET = process.env.BBB_SECRET // To authorize different requests to the server
  ;

module.exports = {
  DATABASE_CLIENT_URL,
  JWT_KEY,
  BBB_URL,
  BBB_SECRET,
};
