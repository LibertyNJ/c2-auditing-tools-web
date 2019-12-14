module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      adcUsernameId: {
        allowNull: false,
        field: 'adc_username_id',
        references: {
          key: 'id',
          model: 'AdcUsername',
        },
        type: DataTypes.UUID,
        unique: 'composite',
        validate: {
          isUUID: 4,
          notNull: true,
        },
      },
      amount: {
        allowNull: false,
        field: 'amount',
        type: DataTypes.REAL,
        validate: {
          isDecimal: true,
          notNull: true,
        },
      },
      date: {
        allowNull: false,
        field: 'date',
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
        field: 'id',
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
        validate: {
          isUUID: 4,
          notNull: true,
        },
      },
      medicalRecordNumber: {
        allowNull: true,
        field: 'medical_record_number',
        type: DataTypes.STRING(8),
        validate: {
          isNumeric: true,
          len: [1, 8],
          notEmpty: true,
        },
      },
      orderId: {
        allowNull: true,
        field: 'order_id',
        references: {
          key: 'id',
          model: 'Order',
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
        field: 'product_id',
        references: {
          key: 'id',
          model: 'Product',
        },
        type: DataTypes.UUID,
        validate: {
          isUUID: 4,
          notNull: true,
        },
      },
      typeId: {
        allowNull: false,
        field: 'transaction_type_id',
        references: {
          key: 'id',
          model: 'TransactionType',
        },
        type: DataTypes.UUID,
        unique: 'composite',
        validate: {
          isUUID: 4,
          notNull: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'transaction',
      underscored: true,
    }
  );

  Transaction.associate = ({
    AdcUsername,
    Order,
    Product,
    TransactionType,
  }) => {
    Transaction.belongsTo(AdcUsername);
    Transaction.belongsTo(Order);
    Transaction.belongsTo(Product);
    Transaction.belongsTo(TransactionType);
  };

  return Transaction;
};
