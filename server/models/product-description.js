module.exports = (sequelize, DataTypes) => {
  const ProductDescription = sequelize.define(
    'ProductDescription',
    {
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
      productId: {
        allowNull: true,
        field: 'product_id',
        references: {
          key: 'id',
          model: 'Product',
        },
        type: DataTypes.UUID,
        unique: true,
        validate: {
          isUUID: 4,
        },
      },
      value: {
        allowNull: false,
        field: 'value',
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'product_description',
      underscored: true,
    }
  );

  ProductDescription.associate = ({ Product }) => {
    ProductDescription.belongsTo(Product);
  };

  return ProductDescription;
};
