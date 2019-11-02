const { createResponse, isNull } = require('../../../util');

module.exports = function getProviders(
  database,
  {
    adcName = null, emarName = null, firstName = null, lastName = null, middleInitial = null,
  },
) {
  const adcIdPredicate = adcName
    ? { column: 'adcIds', operator: 'LIKE', value: `%${adcName}%` }
    : null;
  const emarIdPredicate = emarName
    ? { column: 'emarIds', operator: 'LIKE', value: `%${emarName}%` }
    : null;
  const firstNamePredicate = firstName
    ? { column: 'firstName', operator: 'LIKE', value: `%${firstName}%` }
    : null;
  const lastNamePredicate = lastName
    ? { column: 'lastName', operator: 'LIKE', value: `%${lastName}%` }
    : null;
  const middleInitialPredicate = middleInitial
    ? { column: 'middleInitial', operator: 'IS', value: middleInitial }
    : null;
  const optionalPredicates = [
    adcIdPredicate,
    emarIdPredicate,
    firstNamePredicate,
    lastNamePredicate,
    middleInitialPredicate,
  ].filter(predicate => !isNull(predicate));
  try {
    const records = database.read({
      columns: ['adcIds', 'emarIds', 'firstName', 'id', 'lastName', 'middleInitial'],
      predicates: [...optionalPredicates],
      table: 'providerView',
    });
    const responseBody = {
      records,
      table: 'providers',
    };
    return createResponse('table-records', 'OK', responseBody);
  } catch (error) {
    const responseBody = {
      error,
      table: 'providers',
    };
    return createResponse('table-records', 'ERROR', responseBody);
  }
};
