module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define(
    'Provider',
    {
      firstName: {
        allowNull: false,
        field: 'first_name',
        type: DataTypes.STRING,
        unique: 'composite',
        validate: {
          notEmpty: true,
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
      lastName: {
        allowNull: false,
        field: 'last_name',
        type: DataTypes.STRING,
        unique: 'composite',
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      middleInitial: {
        allowNull: true,
        field: 'middle_initial',
        type: DataTypes.STRING(1),
        unique: 'composite',
        validate: {
          isAlpha: true,
          notEmpty: true,
        },
      },
    },
    {
      freezeTableName: true,
      getterMethods: {
        fullName() {
          let fullName = `${this.lastName}, ${this.firstName}`;

          if (this.middleInitial) {
            fullName += ` ${this.middleInitial}`;
          }

          return fullName;
        },
      },
      tableName: 'provider',
      underscored: true,
    }
  );

  Provider.associate = () => {
    const AdcUsername = sequelize.model('AdcUsername');
    Provider.hasMany(AdcUsername);

    const EmarUsername = sequelize.model('EmarUsername');
    Provider.hasMany(EmarUsername);
  };

  return Provider;
};
