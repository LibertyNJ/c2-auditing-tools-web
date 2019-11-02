const { createResponse, isNull } = require('../../../util');

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
    const records = database.read({
      columns: ['amount', 'id', 'medicationOrderId', 'product', 'provider', 'timestamp', 'type'],
      predicates: [
        { column: 'type', operator: 'IN', value: transactionTypes },
        { column: 'timestamp', operator: '>', value: datetimeStart },
        { column: 'timestamp', operator: '<', value: datetimeEnd },
        ...optionalPredicates,
      ],
      table: 'transactionView',
    });
    const responseBody = {
      records,
      table: 'transactions',
    };
    return createResponse('table-records', 'OK', responseBody);
  } catch (error) {
    const responseBody = {
      error,
      table: 'transactions',
    };
    return createResponse('table-records', 'ERROR', responseBody);
  }
};
