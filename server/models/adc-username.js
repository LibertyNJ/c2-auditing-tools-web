const Sequelize = require('sequelize');

const AdcUsername = Sequelize.define('adcUsername', {
  providerId: {
    references: {
      key: 'id',
      model: 'provider',
    },
    type: Sequelize.STRING,
  },
  value: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
  },
});

module.exports = AdcUsername;
