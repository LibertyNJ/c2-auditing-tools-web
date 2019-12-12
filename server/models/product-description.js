module.exports = (sequelize, DataTypes) => {
  return sequelize.define('productDescription', {
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
