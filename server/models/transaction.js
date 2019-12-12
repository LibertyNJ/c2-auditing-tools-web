const Sequelize = require('sequelize');

const Transaction = Sequelize.define('transaction', {
  amount: {
    allowNull: false,
    type: Sequelize.REAL,
    validate: {
      isDecimal: true,
      notNull: true,
    },
  },
  date: {
    allowNull: false,
    type: Sequelize.DATE,
    unique: 'composite',
    validate: {
      isDate: true,
      notNull: true,
    },
  },
  id: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    type: Sequelize.UUID,
    unique: true,
    validate: {
      isUUID: 4,
      notNull: true,
    },
  },
  mrn: {
    allowNull: true,
    type: Sequelize.INTEGER(8),
    validate: {
      isNumeric: true,
      len: [1, 8],
      notEmpty: true,
    },
  },
  orderId: {
    allowNull: true,
    references: {
      key: 'id',
      model: 'order',
    },
    type: Sequelize.STRING(9),
    validate: {
      isAlphanumeric: true,
      len: [8, 9],
      notEmpty: true,
    },
  },
  productId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'product',
    },
    type: Sequelize.UUID,
    validate: {
      isUUID: 4,
      notNull: true,
    },
  },
  typeId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'transactionType',
    },
    type: Sequelize.UUID,
    unique: 'composite',
    validate: {
      isUUID: 4,
      notNull: true,
    },
  },
  usernameId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'adcUsername',
    },
    type: Sequelize.UUID,
    unique: 'composite',
    validate: {
      isUUID: 4,
      notNull: true,
    },
  },
});

module.exports = Transaction;
