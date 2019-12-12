module.exports = (sequelize, DataTypes) => {
  return sequelize.define('administration', {
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
    orderId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'order',
      },
      type: DataTypes.STRING(9),
      unique: 'composite',
      validate: {
        isAlphanumeric: true,
        len: [8, 9],
        notNull: true,
      },
    },
    usernameId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'emarUsername',
      },
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
  });
};
