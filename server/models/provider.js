module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'provider',
    {
      firstName: {
        allowNull: false,
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
        type: DataTypes.STRING,
        unique: 'composite',
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      middleInitial: {
        allowNull: true,
        type: DataTypes.STRING(1),
        unique: 'composite',
        validate: {
          isAlpha: true,
          notEmpty: true,
        },
      },
    },
    {
      getterMethods: {
        fullName() {
          let fullName = `${this.lastName}, ${this.firstName}`;

          if (this.middleInitial) {
            fullName += ` ${this.middleInitial}`;
          }

          return fullName;
        },
      },
    }
  );
};
