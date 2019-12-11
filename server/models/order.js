const Sequelize = require('sequelize');

const Order = Sequelize.define('order', {
  dose: Sequelize.REAL,
  form: Sequelize.STRING,
  id: {
    primaryKey: true,
    type: Sequelize.STRING(9),
  },
  medicationId: {
    references: {
      key: 'id',
      model: 'medication',
    },
    type: Sequelize.INTEGER,
  },
  units: Sequelize.STRING,
});

module.exports = Order;
