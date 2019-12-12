module.exports = (sequelize, DataTypes) => {
  return sequelize.define('medication', {
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
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
      },
    },
  });
};
