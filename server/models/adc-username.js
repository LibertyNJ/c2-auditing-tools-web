const Sequelize = require('sequelize');

const AdcUsername = Sequelize.define('adcUsername', {
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
  providerId: {
    allowNull: true,
    references: {
      key: 'id',
      model: 'provider',
    },
    type: Sequelize.UUID,
    validate: {
      isUUID: 4,
    },
  },
  value: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notEmpty: true,
      notNull: true,
    },
  },
});

module.exports = AdcUsername;
