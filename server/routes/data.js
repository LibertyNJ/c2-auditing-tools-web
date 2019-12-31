const { Router } = require('express');

const { data: initController } = require('../controllers');

module.exports = db => {
  const controller = initController(db);
  const router = Router();

  router.post('/', controller.post);

  return router;
};
