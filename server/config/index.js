const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database: {
    database: process.env.DATABASE_NAME,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
  },
  port: process.env.PORT || 8000,
};
