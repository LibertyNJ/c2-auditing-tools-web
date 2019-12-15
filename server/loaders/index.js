const path = require('path');

const loadDatabase = require('./database');
const loadRouter = require('./router');
const { database: dbConfig } = require('../config');

module.exports = async app => {
  const modelsDirectory = path.join(__dirname, '..', 'models');
  const db = await loadDatabase(dbConfig, modelsDirectory);
  console.log('Database initialized.');
  loadRouter(app, db);
};
