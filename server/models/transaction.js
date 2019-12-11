const Sequelize = require('sequelize');

const Transaction = Sequelize.define('transaction', {
  amount: {
    allowNull: false,
    type: Sequelize.REAL,
  },
  date: {
    allowNull: false,
    type: Sequelize.DATE,
    unique: 'aggregate',
  },
  mrn: {
    type: Sequelize.INTEGER(8),
  },
  orderId: {
    references: {
      key: 'id',
      model: 'order',
    },
    type: Sequelize.STRING(9),
  },
  productId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'product',
    },
    type: Sequelize.INTEGER,
  },
  typeId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'transactionType',
    },
    type: Sequelize.INTEGER,
    unique: 'aggregate',
  },
  usernameId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'adcUsername',
    },
    type: Sequelize.INTEGER,
    unique: 'aggregate',
  },
});

module.exports = Transaction;
