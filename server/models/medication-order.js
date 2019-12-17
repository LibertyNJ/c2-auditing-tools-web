module.exports = (sequelize, DataTypes) => {
  const MedicationOrder = sequelize.define(
    'MedicationOrder',
    {
      dose: {
        allowNull: true,
        field: 'dose',
        type: DataTypes.REAL,
        validate: {
          isDecimal: true,
        },
      },
      form: {
        allowNull: true,
        field: 'form',
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      id: {
        allowNull: false,
        field: 'id',
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
        field: 'medication_id',
        references: {
          key: 'id',
          model: 'Medication',
        },
        type: DataTypes.UUID,
        validate: {
          isUUID: 4,
        },
      },
      units: {
        allowNull: true,
        field: 'units',
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'medication_order',
      underscored: true,
    }
  );

  MedicationOrder.associate = ({ Administration, Medication, PainReassessment }) => {
    MedicationOrder.hasMany(Administration);
    MedicationOrder.belongsTo(Medication);
    MedicationOrder.hasMany(PainReassessment);
  };

  return MedicationOrder;
};
