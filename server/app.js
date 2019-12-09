const express = require('express');
const mongoose = require('mongoose');

const config = require('./config');
const routes = require('./routes');

const databaseUri = `mongodb+srv://${config.database.user}:${config.database.password}@${config.database.cluster}.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(databaseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', handleError);
db.once('open', handleOpen);

const app = express();
app.use('/', routes);
app.listen(config.port, handleListen);

function handleError(error) {
  const date = new Date();
  console.error(
    `Server encountered error connecting to database. Date:${date.toUTCString()}`,
    '\n',
    error
  );
}

function handleOpen() {
  const date = new Date();
  console.log(`Server connected to database. Date: ${date.toUTCString()}`);
}

function handleListen() {
  const date = new Date();
  console.log(`Server listening on port: ${config.port}. Date: ${date.toUTCString()}`);
}
