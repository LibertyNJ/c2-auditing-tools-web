module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      form: {
        allowNull: false,
        field: 'form',
        type: DataTypes.STRING,
        unique: 'composite',
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        field: 'id',
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
        validate: {
          isUUID: 4,
          notNull: true,
        },
      },
      medicationId: {
        allowNull: false,
        field: 'medication_id',
        references: {
          key: 'id',
          model: 'Medication',
        },
        type: DataTypes.UUID,
        unique: 'composite',
        validate: {
          isUUID: 4,
          notNull: true,
        },
      },
      strength: {
        allowNull: false,
        field: 'strength',
        type: DataTypes.REAL,
        unique: 'composite',
        validate: {
          isDecimal: true,
          notNull: true,
        },
      },
      units: {
        allowNull: false,
        field: 'units',
        type: DataTypes.STRING,
        unique: 'composite',
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'product',
      underscored: true,
    }
  );

  Product.associate = () => {
    const Medication = sequelize.model('Medication');
    Product.belongsTo(Medication);
  
    const ProductDescription = sequelize.model('ProductDescription');
    Product.hasOne(ProductDescription);
  };

  return Product;
};
