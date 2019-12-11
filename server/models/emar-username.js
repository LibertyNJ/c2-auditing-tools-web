const Sequelize = require('sequelize');

const EmarUsername = Sequelize.define('emarUsername', {
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

module.exports = EmarUsername;
