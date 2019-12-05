const { createResponse, isNull } = require('../../../util');

module.exports = function getAdministrations(
  database,
  {
    datetimeEnd, datetimeStart, medication = '', medicationOrderId = '', provider = '',
  },
) {
  const medicationOrderIdPredicate = medicationOrderId
    ? { column: 'medicationOrderId', operator: 'LIKE', value: `%${medicationOrderId}%` }
    : null;
  const medicationPredicate = medication
    ? { column: 'medication', operator: 'LIKE', value: `%${medication}%` }
    : null;
  const providerPredicate = provider
    ? { column: 'provider', operator: 'LIKE', value: `%${provider}%` }
    : null;

  const optionalPredicates = [
    medicationOrderIdPredicate,
    medicationPredicate,
    providerPredicate,
  ].filter(predicate => !isNull(predicate));

  try {
    const records = database.read({
      columns: ['doseWithUnits', 'id', 'medicationWithForm', 'medicationOrderId', 'provider', 'timestamp'],
      predicates: [
        { column: 'timestamp', operator: '>', value: datetimeStart },
        { column: 'timestamp', operator: '<', value: datetimeEnd },
        ...optionalPredicates,
      ],
      table: 'administrationView',
    });
    const responseBody = {
      records,
      table: 'administrations',
    };
    return createResponse('table-records', 'OK', responseBody);
  } catch (error) {
    const responseBody = {
      error,
      table: 'administrations',
    };
    return createResponse('table-records', 'ERROR', responseBody);
  }
};
