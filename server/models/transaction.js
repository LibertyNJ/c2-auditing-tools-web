module.exports = (sequelize, DataTypes) => {
  return sequelize.define('transaction', {
    amount: {
      allowNull: false,
      type: DataTypes.REAL,
      validate: {
        isDecimal: true,
        notNull: true,
      },
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
      unique: 'composite',
      validate: {
        isDate: true,
        notNull: true,
      },
    },
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
    mrn: {
      allowNull: true,
      type: DataTypes.INTEGER(8),
      validate: {
        isNumeric: true,
        len: [1, 8],
        notEmpty: true,
      },
    },
    orderId: {
      allowNull: true,
      references: {
        key: 'id',
        model: 'order',
      },
      type: DataTypes.STRING(9),
      validate: {
        isAlphanumeric: true,
        len: [8, 9],
        notEmpty: true,
      },
    },
    productId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'product',
      },
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
    typeId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'transactionType',
      },
      type: DataTypes.UUID,
      unique: 'composite',
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
    usernameId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'adcUsername',
      },
      type: DataTypes.UUID,
      unique: 'composite',
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
  });
};
