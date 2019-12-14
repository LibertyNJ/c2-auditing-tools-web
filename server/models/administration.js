module.exports = (sequelize, DataTypes) => {
  const Administration = sequelize.define(
    'Administration',
    {
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
      emarUsernameId: {
        allowNull: false,
        field: 'emar_username_id',
        references: {
          key: 'id',
          model: 'EmarUsername',
        },
        type: DataTypes.UUID,
        validate: {
          isUUID: 4,
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
      orderId: {
        allowNull: false,
        field: 'order_id',
        references: {
          key: 'id',
          model: 'Order',
        },
        type: DataTypes.STRING(9),
        unique: 'composite',
        validate: {
          isAlphanumeric: true,
          len: [8, 9],
          notNull: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'administration',
      underscored: true,
    }
  );

  Administration.associate = ({ EmarUsername, Order }) => {
    Administration.belongsTo(EmarUsername);
    Administration.belongsTo(Order);
  };

  return Administration;
};
