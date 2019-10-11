'use-strict';

const { handleError, isNull } = require('../utilities');

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
    return database.read({
      columns: ['doseWithUnits', 'id', 'medication', 'medicationOrderId', 'provider', 'timestamp'],
      predicates: [
        { column: 'timestamp', operator: '>', value: datetimeStart },
        { column: 'timestamp', operator: '<', value: datetimeEnd },
        ...optionalPredicates,
      ],
      table: 'administrationView',
    });
  } catch (error) {
    handleError(error);
  }
};
