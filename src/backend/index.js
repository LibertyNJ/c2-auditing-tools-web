'use-strict';

const path = require('path');

const database = require('./database');

const getAdministrations = require('./get/administrations');
const getDatabaseStatus = require('./get/database-status');
const getLedger = require('./get/ledger');
const getProviderModal = require('./get/provider-modal');
const getProviders = require('./get/providers');
const getTransactions = require('./get/transactions');
const importData = require('./import/data');
const updateProvider = require('./update/provider');

const IS_DEV_MODE = /[\\/]electron/.test(process.execPath);

process.on('message', handleMessage);

const databasePath = IS_DEV_MODE
  ? path.join(__dirname, '..', '..', 'database.db')
  : path.join(__dirname, '..', '..', '..', 'database.db');

database.open(databasePath);
database.setStatus('Initializing…');
database.initialize();
database.setStatus('Ready');

function handleMessage(message) {
  try {
    database.setStatus('Busy…');
    sendMessage({ body: database.getStatus(), channel: 'get-database-status' });
    sendMessage({ body: resolveMessage(message), channel: message.channel });
    database.setStatus('Ready');
    sendMessage({ body: database.getStatus(), channel: 'get-database-status' });
  } catch (error) {
    handleError(error);
  }
}

function resolveMessage({ body = null, channel }) {
  switch (channel) {
    case 'get-administrations':
      return getAdministrations(database, body);
    case 'get-database-status':
      return getDatabaseStatus(database);
    case 'get-ledger':
      return getLedger(database, body);
    case 'get-provider-modal':
      return getProviderModal(database, body);
    case 'get-providers':
      return getProviders(database, body);
    case 'get-transactions':
      return getTransactions(database, body);
    case 'import-data':
      return importData(database, body);
    case 'update-provider':
      return updateProvider(database, body);
    default:
      throw new Error(`Backend received message on unhandled channel: "${channel}"`);
  }
}

function handleError(error) {
  sendErrorMessage(error);

  if (IS_DEV_MODE) {
    console.error(error);
  }
}

function sendErrorMessage({ message }) {
  sendMessage({
    body: `An error occurred: ${message}. Please try again. If the error persists, notify the developer.`,
    channel: 'error',
  });
}

function sendMessage(message) {
  process.send(message);
}
