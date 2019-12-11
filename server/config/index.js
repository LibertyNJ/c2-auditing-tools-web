const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
  },
  port: process.env.PORT || 8000,
};
