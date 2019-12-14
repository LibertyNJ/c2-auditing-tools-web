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

  EmarUsername.associate = ({ Administration, PainReassessment, Provider }) => {
    EmarUsername.hasMany(Administration);
    EmarUsername.hasMany(PainReassessment);
    EmarUsername.belongsTo(Provider);
  };

  return EmarUsername;
};
