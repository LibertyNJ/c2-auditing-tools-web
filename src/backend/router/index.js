const { get, post, put } = require('./methods');

module.exports = {
  route,
  setDatabase,
};

let _database;

function route(request) {
  switch (request.head.method) {
    case 'GET':
      return routeGet(request);
    case 'POST':
      return routePost(request);
    case 'PUT':
      return routePut(request);
    default:
      throw new Error(`Backend received request with unhandled method: ${request.head.method}.`);
  }
}

function routeGet(request) {
  switch (request.head.resource) {
    case 'administrations':
      return get.administrations(_database, request.body);
    case 'edit-provider':
      return get.editProvider(_database, request.body);
    case 'ledger':
      return get.ledger(_database, request.body);
    case 'providers':
      return get.providers(_database, request.body);
    case 'transactions':
      return get.transactions(_database, request.body);
    default:
      throw new Error(
        `Backend received GET request for unhandled resource: ${request.head.resource}.`,
      );
  }
}

function routePost(request) {
  switch (request.head.resource) {
    case 'data':
      return post.data(_database, request.body);
    default:
      throw new Error(
        `Backend received POST request for unhandled resource: ${request.head.resource}.`,
      );
  }
}

function routePut(request) {
  switch (request.head.resource) {
    case 'provider':
      return put.provider(_database, request.body);
    default:
      throw new Error(
        `Backend received PUT request for unhandled resource: ${request.head.resource}.`,
      );
  }
}

function setDatabase(database) {
  _database = database;
}
