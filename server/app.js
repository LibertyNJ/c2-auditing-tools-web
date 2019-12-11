const express = require('express');
const Sequelize = require('sequelize');

const config = require('./config');
// const router = require('./routes');

const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    host: config.database.host,
    port: config.database.port,
  }
);

authenticateDatabase();

const app = express();
// app.use('/', router);
app.listen(config.port, handleListen);

async function authenticateDatabase() {
  try {
    await sequelize.authenticate();
    handleAuthentication();
  } catch (error) {
    handleError(error);
  }
}

function handleAuthentication() {
  const date = new Date();
  console.log(`Server connected to database. Date: ${date.toUTCString()}`);
}

function handleError(error) {
  const date = new Date();
  console.error(
    `Server encountered error connecting to database. Date:${date.toUTCString()}`,
    '\n',
    error
  );
}

function handleListen() {
  const date = new Date();
  console.log(
    `Server listening on port: ${config.port}. Date: ${date.toUTCString()}`
  );
}
