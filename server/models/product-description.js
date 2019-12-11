const Sequelize = require('sequelize');

const ProductDescription = Sequelize.define('productDescription', {
  value: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
  },
});

module.exports = ProductDescription;
