const path = require('path');

const database = require('./database');
const router = require('./router');
const { createResponse } = require('./utilities');

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

function queryDatabase(request) {
  database.setStatus('Busy…');
  sendDatabaseStatusResponse();
  const response = router.routeRequest(request);
  sendResponse(response);
  database.setStatus('Ready');
  sendDatabaseStatusResponse();
}

function handleError(error) {
  sendErrorMessage(error);
  if (isDevMode) {
    console.error(error);
  }
}

function sendErrorMessage({ message }) {
  sendResponse({
    body: `An error occurred: ${message}. Please try again. If the error persists, notify the developer.`,
    channel: 'error',
  });
}

function sendResponse(response) {
  process.send(response);
}

function sendDatabaseStatusResponse() {
  const response = createResponse('database-status', 'OK', database.getStatus());
  sendResponse(response);
}
