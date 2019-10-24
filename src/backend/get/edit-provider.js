const { createResponse } = require('../utilities');

module.exports = function getEditProvider(database, providerId) {
  try {
    const data = getEditProviderFormData(database, providerId);
    const responseBody = {
      data,
      form: 'editProvider',
    };
    return createResponse('form-data', 'OK', responseBody);
  } catch (error) {
    const responseBody = {
      error,
      form: 'editProvider',
    };
    return createResponse('form-data', 'ERROR', responseBody);
  }
};

function getEditProviderFormData(database, providerId) {
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
