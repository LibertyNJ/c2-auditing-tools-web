const Sequelize = require('sequelize');

const Medication = Sequelize.define('medication', {
  name: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
  },
});

module.exports = Medication;
