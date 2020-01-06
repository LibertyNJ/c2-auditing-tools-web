const path = require('path');

const initDatabase = require('./database');
const loadMiddleware = require('./middleware');
const loadRouter = require('../routes');
const { database: dbConfig } = require('../config');

module.exports = async app => {
  loadMiddleware(app);

  const modelsDirectory = path.join(__dirname, '..', 'models');
  const db = await initDatabase(dbConfig, modelsDirectory);
  console.log('Database initialized.');

  loadRouter(app, db);
};
