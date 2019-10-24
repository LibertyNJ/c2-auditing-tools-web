const getAdministrations = require('./get/administrations');
const getLedger = require('./get/ledger');
const getEditProvider = require('./get/edit-provider');
const getProviders = require('./get/providers');
const getTransactions = require('./get/transactions');
const postData = require('./post/data');
const putProvider = require('./put/provider');

module.exports = {
  routeRequest,
  setDatabase,
};

let _database;

function routeRequest(request) {
  switch (request.head.method) {
    case 'GET':
      return routeGetRequest(request);
    case 'POST':
      return routePostRequest(request);
    case 'PUT':
      return routePutRequest(request);
    default:
      throw new Error(`Backend received request with unhandled method: ${request.head.method}.`);
  }
}

function routeGetRequest(request) {
  switch (request.head.resource) {
    case 'administrations':
      return getAdministrations(_database, request.body);
    case 'edit-provider':
      return getEditProvider(_database, request.body);
    case 'ledger':
      return getLedger(_database, request.body);
    case 'providers':
      return getProviders(_database, request.body);
    case 'transactions':
      return getTransactions(_database, request.body);
    default:
      throw new Error(
        `Backend received GET request for unhandled resource: ${request.head.resource}.`,
      );
  }
}

function routePostRequest(request) {
  switch (request.head.resource) {
    case 'data':
      return postData(_database, request.body);
    default:
      throw new Error(
        `Backend received POST request for unhandled resource: ${request.head.resource}.`,
      );
  }
}

function routePutRequest(request) {
  switch (request.head.resource) {
    case 'provider':
      return putProvider(_database, request.body);
    default:
      throw new Error(
        `Backend received PUT request for unhandled resource: ${request.head.resource}.`,
      );
  }
}

function setDatabase(database) {
  _database = database;
}
