const Sequelize = require('sequelize');

const PainReassessment = Sequelize.define('painReassessment', {
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

module.exports = PainReassessment;
