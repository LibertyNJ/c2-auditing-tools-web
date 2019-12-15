const { Router } = require('express');

const administration = require('./administration');
const data = require('./data');
const ledger = require('./ledger');
const provider = require('./provider');
const transaction = require('./transaction');

module.exports = db => {
  const router = Router();

  router.use('/administration', administration(db));
  router.use('/data', data(db));
  router.use('/ledger', ledger(db));
  router.use('/provider', provider(db));
  router.use('/transaction', transaction(db));

  return router;
};
