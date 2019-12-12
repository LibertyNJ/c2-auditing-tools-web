module.exports = (sequelize, DataTypes) => {
  return sequelize.define('order', {
    dose: {
      allowNull: true,
      type: DataTypes.REAL,
      validate: {
        isDecimal: true,
      },
    },
    form: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(9),
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [8, 9],
        notNull: true,
      },
    },
    medicationId: {
      allowNull: true,
      references: {
        key: 'id',
        model: 'medication',
      },
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
    },
    units: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  });
};
