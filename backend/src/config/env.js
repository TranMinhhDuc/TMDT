const dotenv = require('dotenv');
dotenv.config('/.env');

const PORT = process.env.PORT;
const PORT_DB = process.env.PORT_DB;

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DB_NAME = process.env.DB_NAME;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const cloudName = process.env.CLOUD_NAME;
const cloudApiKey = process.env.API_KEY;
const cloudApiSecret = process.env.API_SECRET;

module.exports = {
  PORT,
  HOST,
  PORT_DB,
  USER,
  PASSWORD,
  DB_NAME,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  cloudName,
  cloudApiKey,
  cloudApiSecret
};
