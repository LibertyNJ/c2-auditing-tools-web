const express = require('express');

const administration = require('./administration');
const data = require('./data');
const ledger = require('./ledger');
const provider = require('./provider');
const transaction = require('./transaction');

const router = express.Router();
router.use('/administration', administration);
router.use('/data', data);
router.use('/ledger', ledger);
router.use('/provider', provider);
router.use('/transaction', transaction);

module.exports = router;
