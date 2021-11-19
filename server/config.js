require('dotenv').config();

const DATABASE_CLIENT_URL = process.env.DATABASE_CLIENT_URL,
  JWT_KEY = process.env.JWT_KEY;

module.exports = {
  DATABASE_CLIENT_URL,
  JWT_KEY,
};
