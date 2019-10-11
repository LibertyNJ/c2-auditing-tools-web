'use-strict';

const { handleError } = require('../utilities');

module.exports = function getDatabaseStatus(database) {
  try {
    return database.getStatus();
  } catch (error) {
    handleError(error);
  }
};
