const { createResponse } = require('../../../util');

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
    orderBy: { columns: ['name'], direction: 'ASC' },
    predicates: [{ column: 'providerId', operator: '=', value: providerId }],
    table: 'providerAdc',
  });
}

function getAssignedProviderEmars(database, providerId) {
  return database.read({
    columns: ['id', 'name'],
    orderBy: { columns: ['name'], direction: 'ASC' },
    predicates: [{ column: 'providerId', operator: '=', value: providerId }],
    table: 'providerEmar',
  });
}

function getUnassignedProviderAdcs(database) {
  return database.read({
    columns: ['id', 'name'],
    orderBy: { columns: ['name'], direction: 'ASC' },
    predicates: [{ column: 'providerId', operator: 'IS', value: null }],
    table: 'providerAdc',
  });
}

function getUnassignedProviderEmars(database) {
  return database.read({
    columns: ['id', 'name'],
    orderBy: { columns: ['name'], direction: 'ASC' },
    predicates: [{ column: 'providerId', operator: 'IS', value: null }],
    table: 'providerEmar',
  });
}

const { createResponse } = require('../../../util');

let database;

module.exports = function putProvider(
  passedDatabase,
  {
    firstName,
    lastName,
    middleInitial = null,
    providerAdcIdsToBeAssigned,
    providerAdcIdsToBeUnassigned,
    providerEmarIdsToBeAssigned,
    providerEmarIdsToBeUnassigned,
    providerId,
  },
) {
  database = passedDatabase;
  try {
    updateProviderById({
      firstName,
      lastName,
      middleInitial,
      providerId,
    });
    assignProviderAdcIds({ adcIds: providerAdcIdsToBeAssigned, providerId });
    assignProviderEmarIds({ emarIds: providerEmarIdsToBeAssigned, providerId });
    unassignProviderAdcIds(providerAdcIdsToBeUnassigned);
    unassignProviderEmarIds(providerEmarIdsToBeUnassigned);
    const response = createResponse('put', 'OK', { resource: 'provider' });
    return response;
  } catch (error) {
    const response = createResponse('put', 'ERROR', error);
    return response;
  }
};

function updateProviderById({
  firstName, lastName, middleInitial, providerId,
}) {
  database.update({
    data: { firstName, lastName, middleInitial },
    predicates: [{ column: 'id', operator: '=', value: providerId }],
    table: 'provider',
  });
}

function assignProviderAdcIds({ adcIds, providerId }) {
  adcIds.forEach(adcId => updateProviderNameByIdAndNameType({ id: adcId, nameType: 'Adc', providerId }));
}

function assignProviderEmarIds({ emarIds, providerId }) {
  emarIds.forEach(emarId => updateProviderNameByIdAndNameType({ id: emarId, nameType: 'Emar', providerId }));
}

function unassignProviderAdcIds(adcIds) {
  adcIds.forEach(adcId => updateProviderNameByIdAndNameType({ id: adcId, nameType: 'Adc', providerId: null }));
}

function unassignProviderEmarIds(emarIds) {
  emarIds.forEach(emarId => updateProviderNameByIdAndNameType({ id: emarId, nameType: 'Emar', providerId: null }));
}

function updateProviderNameByIdAndNameType({ id, nameType, providerId }) {
  database.update({
    data: { providerId },
    predicates: [{ column: 'id', operator: '=', value: id }],
    table: `provider${nameType}`,
  });
}
