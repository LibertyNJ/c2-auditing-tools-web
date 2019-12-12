const Sequelize = require('sequelize');

const Provider = Sequelize.define(
  'provider',
  {
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: 'composite',
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
      unique: true,
      validate: {
        isUUID: 4,
        notNull: true,
      },
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: 'composite',
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    middleInitial: {
      allowNull: true,
      type: Sequelize.STRING(1),
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

module.exports = Provider;
