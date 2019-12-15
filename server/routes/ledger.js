const { Router } = require('express');

const { ledger: Controller } = require('../controllers');

module.exports = db => {
  const controller = Controller(db);
  const router = Router();

  router.get('/', controller.get);

  return router;
};
