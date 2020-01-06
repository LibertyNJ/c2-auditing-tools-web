const administration = require('./administration');
const data = require('./data');
const editProvider = require('./edit-provider');
const ledger = require('./ledger');
const provider = require('./provider');
const transaction = require('./transaction');

module.exports = (app, db) => {
  app.use('/administrations', administration(db));
  // app.use('/data', data(db));
  // app.use('/edit-provider', editProvider(db));
  app.use('/ledger', ledger(db));
  // app.use('/providers', provider(db));
  app.use('/transactions', transaction(db));
};
