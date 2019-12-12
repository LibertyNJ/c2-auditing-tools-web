module.exports = (sequelize, DataTypes) => {
  return sequelize.define('product', {
    descriptionId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'productDescription',
      },
      type: DataTypes.UUID,
      unique: true,
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
    form: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
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
    medicationId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'medication',
      },
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
    strength: {
      allowNull: false,
      type: DataTypes.REAL,
      validate: {
        isDecimal: true,
        notNull: true,
      },
    },
    units: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
  });
};
