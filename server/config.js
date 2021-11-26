require('dotenv').config();

const DATABASE_CLIENT_URL = process.env.DATABASE_CLIENT_URL,
  JWT_KEY = process.env.JWT_KEY,
  BBB_URL = process.env.BBB_URL, 
  BBB_SECRET = process.env.BBB_SECRET
  ;

module.exports = {
  DATABASE_CLIENT_URL,
  JWT_KEY,
  BBB_URL,
  BBB_SECRET,
};
