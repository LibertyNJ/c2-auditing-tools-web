'use-strict';

const { handleError } = require('../utilities');

module.exports = function getProviderModal(database, providerId) {
  try {
    return getProviderModalData(database, providerId);
  } catch (error) {
    handleError(error);
  }
};

function getProviderModalData(database, providerId) {
  const { firstName, lastName, middleInitial } = getProviderName(database, providerId);
  return {
    assignedProviderAdcs: getAssignedProviderAdcs(database, providerId),
    assignedProviderEmars: getAssignedProviderEmars(database, providerId),
    firstName,
    lastName,
    middleInitial,
    providerId,
    unassignedProviderAdcs: getUnassignedProviderAdcs(database),
    unassignedProviderEmars: getUnassignedProviderEmars(database),
  };
}

function getProviderName(database, providerId) {
  return database.read({
    columns: ['firstName', 'lastName', 'middleInitial'],
    predicates: [{ column: 'id', operator: '=', value: providerId }],
    table: 'provider',
  });
}

function getAssignedProviderAdcs(database, providerId) {
  return database.read({
    columns: ['id', 'name'],
    predicates: [{ column: 'providerId', operator: '=', value: providerId }],
    table: 'providerAdc',
  });
}

function getAssignedProviderEmars(database, providerId) {
  return database.read({
    columns: ['id', 'name'],
    predicates: [{ column: 'providerId', operator: '=', value: providerId }],
    table: 'providerEmar',
  });
}

function getUnassignedProviderAdcs(database) {
  return database.read({
    columns: ['id', 'name'],
    predicates: [{ column: 'providerId', operator: 'IS', value: null }],
    table: 'providerAdc',
  });
}

function getUnassignedProviderEmars(database) {
  return database.read({
    columns: ['id', 'name'],
    predicates: [{ column: 'providerId', operator: 'IS', value: null }],
    table: 'providerEmar',
  });
}
