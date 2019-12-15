const { Router } = require('express');

const { data: Controller } = require('../controllers');

module.exports = db => {
  const controller = Controller(db);
  const router = Router();

  router.post('/', controller.post);

  return router;
};
