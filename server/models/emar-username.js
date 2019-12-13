module.exports = (sequelize, DataTypes) => {
  const EmarUsername = sequelize.define(
    'EmarUsername',
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
      providerId: {
        allowNull: true,
        field: 'provider_id',
        references: {
          key: 'id',
          model: 'Provider',
        },
        type: DataTypes.UUID,
        validate: {
          isUUID: 4,
        },
      },
      value: {
        allowNull: false,
        field: 'value',
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'emar_username',
      underscored: true,
    }
  );

  EmarUsername.associate = () => {
    const Administration = sequelize.model('Administration');
    EmarUsername.hasMany(Administration);

    const PainReassessment = sequelize.model('PainReassessment');
    EmarUsername.hasMany(PainReassessment);

    const Provider = sequelize.model('Provider');
    EmarUsername.belongsTo(Provider);
  };

  return EmarUsername;
};
