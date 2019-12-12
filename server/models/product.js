const Sequelize = require('sequelize');

const Product = Sequelize.define('product', {
  descriptionId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'productDescription',
    },
    type: Sequelize.UUID,
    unique: true,
    validate: {
      isUUID: 4,
      notNull: true,
    },
  },
  form: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
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
  medicationId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'medication',
    },
    type: Sequelize.UUID,
    validate: {
      isUUID: 4,
      notNull: true,
    },
  },
  strength: {
    allowNull: false,
    type: Sequelize.REAL,
    validate: {
      isDecimal: true,
      notNull: true,
    },
  },
  units: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      notNull: true,
    },
  },
});

module.exports = Product;
