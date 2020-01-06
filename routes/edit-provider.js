const { Router } = require('express');

const { provider: initController } = require('../controllers');

module.exports = db => {
  const controller = initController(db);
  const router = Router();

  router.route('/').get(controller.getEdit);

  return router;
};
