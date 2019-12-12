const Sequelize = require('sequelize');

const TransactionType = Sequelize.define('transactionType', {
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
  value: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isAlpha: true,
      notEmpty: true,
      notNull: true,
    },
  },
});

module.exports = TransactionType;
