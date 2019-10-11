'use-strict';

const { handleError, isNull } = require('../utilities');

module.exports = function getTransactions(
  database,
  {
    datetimeEnd,
    datetimeStart,
    medicationOrderId = null,
    product = null,
    provider = null,
    transactionTypes,
  },
) {
  const medicationOrderIdPredicate = medicationOrderId
    ? { column: 'medicationOrderId', operator: 'LIKE', value: `%${medicationOrderId}%` }
    : null;
  const productPredicate = product
    ? { column: 'product', operator: 'LIKE', value: `%${product}%` }
    : null;
  const providerPredicate = provider
    ? { column: 'provider', operator: 'LIKE', value: `%${provider}%` }
    : null;

  const optionalPredicates = [
    medicationOrderIdPredicate,
    productPredicate,
    providerPredicate,
  ].filter(predicate => !isNull(predicate));

  try {
    return database.read({
      columns: [
        'amount',
        'id',
        'medicationOrderId',
        'product',
        'provider',
        'timestamp',
        'type',
      ],
      predicates: [
        { column: 'type', operator: 'IN', value: transactionTypes },
        { column: 'timestamp', operator: '>', value: datetimeStart },
        { column: 'timestamp', operator: '<', value: datetimeEnd },
        ...optionalPredicates,
      ],
      table: 'transactionView',
    });
  } catch (error) {
    handleError(error);
  }
};
