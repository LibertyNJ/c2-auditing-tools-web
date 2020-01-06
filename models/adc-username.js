module.exports = (sequelize, DataTypes) => {
  const AdcUsername = sequelize.define(
    'AdcUsername',
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
      tableName: 'adc_username',
      underscored: true,
    }
  );

  AdcUsername.associate = ({ Provider, Transaction }) => {
    AdcUsername.belongsTo(Provider);
    AdcUsername.hasMany(Transaction);
  };

  return AdcUsername;
};
