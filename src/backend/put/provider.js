const { createResponse } = require('../utilities');

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
