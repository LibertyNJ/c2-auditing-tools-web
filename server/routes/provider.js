const { Router } = require('express');

const { provider: Controller } = require('../controllers');

module.exports = db => {
  const controller = Controller(db);
  const router = Router();

  router
    .route('/')
    .get(controller.get)
    .put(controller.put);

  return router;
};
