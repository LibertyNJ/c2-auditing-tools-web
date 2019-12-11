const Sequelize = require('sequelize');

const Administration = Sequelize.define('administration', {
  date: {
    allowNull: false,
    type: Sequelize.DATE,
    unique: 'aggregate',
  },
  orderId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'order',
    },
    type: Sequelize.STRING(9),
    unique: 'aggregate',
  },
  usernameId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'emarUsername',
    },
    type: Sequelize.INTEGER,
  },
});

module.exports = Administration;
