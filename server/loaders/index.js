const path = require('path');

const initDatabase = require('./database');
const mountRoutes = require('../routes');
const { database: dbConfig } = require('../config');

module.exports = async app => {
  const modelsDirectory = path.join(__dirname, '..', 'models');
  const db = await initDatabase(dbConfig, modelsDirectory);
  console.log('Database initialized.');
  mountRoutes(app, db);
};
