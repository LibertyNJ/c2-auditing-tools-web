const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const {
  medicationNames,
  transactionTypeValues,
} = require('../config/database');

module.exports = async (config, modelsDirectory) => {
  try {
    const db = new Sequelize(config.connectionString, {
      dialectOptions: { ssl: true },
      pool: {
        max: 20,
      },
    });

    await db.authenticate();
    importModels(db, modelsDirectory);
    associateModels(db);
    await db.sync();

    await createMedications(medicationNames, db);
    await createTransactionTypes(transactionTypeValues, db);
    await createOverrideMedicationOrder(db);

    // const adcUsernames = await db.models.AdcUsername.findAll({ raw: true });
    // console.log('ADC', adcUsernames);

    // const emarUsernames = await db.models.EmarUsername.findAll({ raw: true });
    // console.log('EMAR', emarUsernames);

    return db;
  } catch (error) {
    handleError(error);
  }
};

function importModels(db, directory) {
  const filenames = fs.readdirSync(directory);
  const filepaths = filenames.map(filename => path.join(directory, filename));
  filepaths.forEach(filepath => db.import(filepath));
}

function associateModels(db) {
  Object.values(db.models).forEach(model => {
    if (hasAssociatedModels(model)) {
      model.associate(db.models);
    }
  });
}

function hasAssociatedModels(model) {
  return Object.prototype.hasOwnProperty.call(model, 'associate');
}

async function createMedications(names, db) {
  const medications = names.map(name => ({
    name,
  }));

  await db.models.Medication.bulkCreate(medications, {
    ignoreDuplicates: true,
  });
}

async function createTransactionTypes(values, db) {
  const transactionTypes = values.map(value => ({
    value,
  }));

  await db.models.TransactionType.bulkCreate(transactionTypes, {
    ignoreDuplicates: true,
  });
}

async function createOverrideMedicationOrder(db) {
  await db.models.MedicationOrder.create(
    { id: 'OVERRIDE' },
    { ignoreDuplicates: true }
  );
}

function handleError(error) {
  error.message =
    'An error occurred while initializing the database: ' + error.message;
  throw error;
}
