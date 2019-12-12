module.exports = (sequelize, DataTypes) => {
  return sequelize.define('adcUsername', {
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
    providerId: {
      allowNull: true,
      references: {
        key: 'id',
        model: 'provider',
      },
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
    },
    value: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
  });
};
