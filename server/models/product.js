const Sequelize = require('sequelize');

const Product = Sequelize.define('product', {
  descriptionId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'productDescription',
    },
    type: Sequelize.INTEGER,
    unique: true,
  },
  form: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  medicationId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'medication',
    },
    type: Sequelize.INTEGER,
  },
  strength: {
    allowNull: false,
    type: Sequelize.REAL,
  },
  units: {
    allowNull: false,
    type: Sequelize.STRING,
  },
});

module.exports = Product;
