const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

module.exports = app => {
  app.use(express.static('client/dist'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
};
