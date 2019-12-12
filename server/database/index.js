const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const { database } = require('../config');

const db = connect();
testConnection(db);
importModels(db);
syncModels(db);

module.exports = db;

function connect() {
  return new Sequelize(database.name, database.username, database.password, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    host: database.host,
    port: database.port,
  });
}

async function testConnection(db) {
  try {
    await db.authenticate();
    logConnection();
  } catch (error) {
    handleError(error);
  }
}

function importModels(db) {
  const directoryPath = path.join(__dirname, '..', 'models');
  const filenames = fs.readdirSync(directoryPath);
  const filepaths = filenames.map(filename => {
    return path.join(directoryPath, filename);
  });

  filepaths.forEach(db.import);
}

function logConnection() {
  const date = new Date();
  console.log(`Server connected to database. Date: ${date.toUTCString()}`);
}

function handleError(error) {
  const date = new Date();
  console.error(
    `Server encountered an error while connecting to database. Date:${date.toUTCString()}`,
    '\n',
    error
  );
}

function syncModels(db) {
  db.sync();
}
