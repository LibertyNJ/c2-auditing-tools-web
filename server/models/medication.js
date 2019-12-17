module.exports = (sequelize, DataTypes) => {
  const Medication = sequelize.define(
    'Medication',
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
      name: {
        allowNull: false,
        field: 'name',
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notNull: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'medication',
      underscored: true,
    }
  );

  Medication.associate = ({ MedicationOrder, Product }) => {
    Medication.hasMany(MedicationOrder);
    Medication.hasMany(Product);
  };

  return Medication;
};
