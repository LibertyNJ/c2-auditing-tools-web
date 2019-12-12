const Sequelize = require('sequelize');

const ProductDescription = Sequelize.define('productDescription', {
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

module.exports = ProductDescription;
