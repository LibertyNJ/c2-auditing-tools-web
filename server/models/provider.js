const Sequelize = require('sequelize');

const Provider = Sequelize.define('provider', {
  firstName: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: 'aggregate',
  },
  lastName: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: 'aggregate',
  },
  middleInitial: {
    type: Sequelize.STRING(1),
    unique: 'aggregate',
  },
});

module.exports = Provider;
