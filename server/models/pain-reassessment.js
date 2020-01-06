module.exports = (sequelize, DataTypes) => {
  const PainReassessment = sequelize.define(
    'PainReassessment',
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
      medicationOrderId: {
        allowNull: false,
        field: 'medication_order_id',
        references: {
          key: 'id',
          model: 'MedicationOrder',
        },
        type: DataTypes.STRING(9),
        unique: 'composite',
        validate: {
          isAlphanumeric: true,
          len: [8, 9],
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
    },
    {
      freezeTableName: true,
      tableName: 'pain_reassessment',
      underscored: true,
    }
  );

  PainReassessment.associate = ({ EmarUsername, MedicationOrder }) => {
    PainReassessment.belongsTo(EmarUsername);
    PainReassessment.belongsTo(MedicationOrder);
  };

  return PainReassessment;
};
