const { Router } = require('express');

const { transaction: Controller } = require('../controllers');

module.exports = db => {
  const controller = Controller(db);
  const router = Router();

  router.get('/', controller.get);

  return router;
};
