require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(DATABASE_URL, {
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
