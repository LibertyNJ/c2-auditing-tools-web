'use-strict';

const { handleError } = require('../../utilities');

let database;

module.exports = function createProviders(database) {
  setDatabase(database);
  try {
    const providerEmars = selectProviderEmars();
    providerEmars.forEach(createProvider);
  } catch (error) {
    handleError(error);
  }
};

function setDatabase(value) {
  database = value;
}

function selectProviderEmars() {
  return database.read({ table: 'providerEmar' });
}

function createProvider(providerEmar) {
  if (!isAssignedProviderId(providerEmar)) {
    insertProviderAndUpdateProviderNames(providerEmar);
  }
}

function isAssignedProviderId({ providerId }) {
  return !!providerId;
}

function insertProviderAndUpdateProviderNames(providerEmar) {
  const transaction = database.transaction(() => {
    const providerName = getProviderName(providerEmar);
    insertProvider(providerName);

    const providerId = selectProviderId(providerName);
    updateProviderEmar(providerEmar, providerId);
    updateProviderAdc(providerName, providerId);
  });

  transaction();
}

function getProviderName({ name }) {
  const [lastName, firstName, middleInitial] = splitNames(name);
  return { lastName, firstName, middleInitial };
}

function splitNames(name) {
  const [lastName, remainder] = name.split(', ');
  const middleInitial = hasMiddleInitial(remainder) ? extractMiddleInitial(remainder) : null;
  const firstName = middleInitial ? extractFirstName(remainder) : remainder;
  return [lastName, firstName, middleInitial];
}

function hasMiddleInitial(remainder) {
  return /\s\w$/.test(remainder);
}

function extractMiddleInitial(remainder) {
  return remainder.match(/\w$/)[0];
}

function extractFirstName(remainder) {
  const MIDDLE_INITIAL_LENGTH = 2;
  const firstNameLength = remainder.length - MIDDLE_INITIAL_LENGTH;
  const FIRST_NAME_START = 0;
  return remainder.slice(FIRST_NAME_START, firstNameLength);
}

function insertProvider({ firstName, lastName, middleInitial = null }) {
  database.create({
    data: { firstName, lastName, middleInitial },
    onConflict: 'IGNORE',
    table: 'provider',
  });
}

function selectProviderId({ firstName, lastName, middleInitial = null }) {
  return database.read({
    columns: ['id'],
    predicates: [
      { column: 'firstName', operator: 'LIKE', value: firstName },
      { column: 'lastName', operator: 'LIKE', value: lastName },
      { column: 'middleInitial', operator: 'IS', value: middleInitial },
    ],
    table: 'provider',
  });
}

function updateProviderEmar(providerId, { id }) {
  database.update({
    data: { providerId },
    predicates: [{ column: 'id', operator: '=', value: id }],
    table: 'providerEmar',
  });
}

function updateProviderAdc(providerId, { lastName, firstName }) {
  const providerAdcName = createProviderAdcName(lastName, firstName);
  database.update({
    data: { providerId },
    predicates: [{ column: 'name', operator: 'LIKE', value: providerAdcName }],
    table: 'providerAdc',
  });
}

function createProviderAdcName(lastName, firstName) {
  return `${lastName}, ${firstName}`;
}
