const { Router } = require('express');

const { ledger: initController } = require('../controllers');

module.exports = db => {
  const controller = initController(db);
  const router = Router();

  router.get('/', controller.get);

  return router;
};
