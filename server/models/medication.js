const Sequelize = require('sequelize');

const Medication = Sequelize.define('medication', {
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
  name: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notNull: true,
    }
  },
});

module.exports = Medication;
