const mongoose = require('mongoose');

const { database } = require('./config');

const databaseUri = `mongodb+srv://${database.user}:${database.password}@${database.cluster}.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(databaseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', handleError);
db.once('open', handleOpen);

function handleError(error) {
  console.error('Encountered error connecting to database:\n', error);
}

function handleOpen() {
  console.log('Connected to database.');
  db.close();
}
