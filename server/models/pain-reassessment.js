const Sequelize = require('sequelize');

const PainReassessment = Sequelize.define('painReassessment', {
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
  orderId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'order',
    },
    type: Sequelize.STRING(9),
    unique: 'composite',
    validate: {
      isAlphanumeric: true,
      len: [8, 9],
      notNull: true,
    },
  },
  usernameId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'emarUsername',
    },
    type: Sequelize.UUID,
    validate: {
      isUUID: 4,
      notNull: true,
    },
  },
});

module.exports = PainReassessment;
