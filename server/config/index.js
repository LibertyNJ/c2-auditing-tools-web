const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database: {
    cluster: process.env.DATABASE_CLUSTER,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
  },
  port: process.env.PORT || 8000,
};
