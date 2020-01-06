const { Router } = require('express');
const multer = require('multer');

const { data: initController } = require('../controllers');

module.exports = db => {
  const controller = initController(db);
  const router = Router();
  const upload = multer({ dest: 'data/' });

  router.post(
    '/',
    upload.fields([
      { name: 'adcReport', maxCount: 1 },
      { name: 'emarReport', maxCount: 1 },
    ]),
    controller.post
  );

  return router;
};
