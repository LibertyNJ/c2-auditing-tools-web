const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database: {
    connectionString: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
  },
  port: process.env.PORT || 8000,
};
