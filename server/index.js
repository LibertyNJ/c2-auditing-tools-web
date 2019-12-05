const path = require('path');
const database = require('./database');
const router = require('./router');
const { createResponse } = require('./util');

const isDevMode = /[\\/]electron/.test(process.execPath);
const databasePath = isDevMode
  ? path.join(__dirname, '..', '..', 'database.db')
  : path.join(__dirname, '..', '..', '..', 'database.db');

router.setDatabase(database);
process.on('message', handleMessage);
database.open(databasePath);
database.setStatus('Initializing…');
database.initialize();
database.setStatus('Ready');
sendDatabaseStatusResponse();

function handleMessage(message) {
  if (isDatabaseStatusRequest(message)) {
    sendDatabaseStatusResponse();
  } else {
    handleRequest(message);
  }
}

function isDatabaseStatusRequest(message) {
  return message.head.resource === 'database-status';
}

function handleRequest(request) {
  try {
    queryDatabase(request);
  } catch (error) {
    handleError(error);
  }
}

async function queryDatabase(request) {
  database.setStatus('Busy…');
  sendDatabaseStatusResponse();
  const response = await router.route(request);
  sendResponse(response);
  database.setStatus('Ready');
  sendDatabaseStatusResponse();
}

function handleError(error) {
  if (isDevMode) console.error(error);
}

function sendResponse(response) {
  process.send(response);
}

function sendDatabaseStatusResponse() {
  const response = createResponse('database-status', 'OK', database.getStatus());
  sendResponse(response);
}
