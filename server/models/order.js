const Sequelize = require('sequelize');

const Order = Sequelize.define('order', {
  dose: {
    allowNull: true,
    type: Sequelize.REAL,
    validate: {
      isDecimal: true,
    },
  },
  form: {
    allowNull: true,
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING(9),
    unique: true,
    validate: {
      isAlphanumeric: true,
      len: [8, 9],
      notNull: true,
    },
  },
  medicationId: {
    allowNull: true,
    references: {
      key: 'id',
      model: 'medication',
    },
    type: Sequelize.UUID,
    validate: {
      isUUID: 4,
    },
  },
  units: {
    allowNull: true,
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Order;
