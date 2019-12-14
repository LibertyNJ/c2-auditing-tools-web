const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

module.exports = async (config, modelsDirectory) => {
  try {
    const db = new Sequelize(config);

    await db.authenticate();
    importModels(db, modelsDirectory);
    associateModels(db);
    await db.sync();

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

function handleError(error) {
  throw new Error(
    `An error occurred while loading the database: ${error.stack}`
  );
}
