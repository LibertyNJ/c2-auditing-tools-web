const express = require('express');

const router = express.Router();
router
  .route('/')
  .get((req, res) => {
    res.status(200).send('provider GET');
  })
  .put((req, res) => {
    res.status(200).send('provider PUT');
  });

module.exports = router;
