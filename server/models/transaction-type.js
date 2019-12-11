const Sequelize = require('sequelize');

const TransactionType = Sequelize.define('transactionType', {
  value: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
  },
});

module.exports = TransactionType;
