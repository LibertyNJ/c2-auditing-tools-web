module.exports = (sequelize, DataTypes) => {
  const TransactionType = sequelize.define(
    'TransactionType',
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
      value: {
        allowNull: false,
        field: 'value',
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlpha: true,
          notEmpty: true,
          notNull: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'transaction_type',
      underscored: true,
    }
  );

  TransactionType.associate = ({ Transaction }) => {
    TransactionType.hasMany(Transaction);
  };

  return TransactionType;
};
