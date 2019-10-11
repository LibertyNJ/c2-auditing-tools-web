'use-strict';

const { handleError, isArray, isNull } = require('../../utilities');
const createLedger = require('./create-ledger');

module.exports = function getLedger(
  database,
  {
    datetimeEnd, datetimeStart, medicationOrderId = null, product = null, provider = null,
  },
) {
  try {
    const transactions = getTransactions(database, {
      datetimeEnd,
      datetimeStart,
      product,
    });

    const administrations = getAdministrations(database, {
      datetimeEnd,
      datetimeStart,
      product,
    });

    const painReassessments = getPainReassessments(database, {
      datetimeEnd,
      datetimeStart,
      product,
    });

    const { otherTransactions, wastes, withdrawals } = splitByTransactionType(transactions);
    const selectedWithdrawals = withdrawals.filter(withdrawal => isMatchingRecord(withdrawal, medicationOrderId, provider));

    const ledger = createLedger({
      administrations,
      otherTransactions,
      painReassessments,
      selectedWithdrawals,
      wastes,
      withdrawals,
    });

    return ledger.filter(record => isMatchingRecord(record, medicationOrderId, provider));
  } catch (error) {
    handleError(error);
  }
};

function getTransactions(database, { datetimeEnd, datetimeStart, product = null }) {
  const productPredicate = product
    ? { column: 'product', operator: 'LIKE', value: `%${product}%` }
    : null;

  const optionalPredicates = [productPredicate].filter(predicate => !isNull(predicate));

  return database.read({
    columns: ['*'],
    predicates: [
      { column: 'timestamp', operator: '>', value: datetimeStart },
      { column: 'timestamp', operator: '<', value: datetimeEnd },
      ...optionalPredicates,
    ],
    table: 'transactionView',
  });
}

function getAdministrations(database, { datetimeEnd, datetimeStart }) {
  return database.read({
    columns: ['*'],
    predicates: [
      { column: 'timestamp', operator: '>', value: datetimeStart },
      { column: 'timestamp', operator: '<', value: datetimeEnd },
    ],
    table: 'administrationView',
  });
}

function getPainReassessments(database, { datetimeEnd, datetimeStart }) {
  return database.read({
    columns: ['*'],
    predicates: [
      { column: 'timestamp', operator: '>', value: datetimeStart },
      { column: 'timestamp', operator: '<', value: datetimeEnd },
    ],
    table: 'painReassessmentView',
  });
}

function splitByTransactionType(transactions) {
  return {
    otherTransactions: transactions.filter(transaction => isType(transaction, ['Restock', 'Return'])),
    wastes: transactions.filter(transaction => isType(transaction, 'Waste')),
    withdrawals: transactions.filter(transaction => isType(transaction, 'Withdrawal')),
  };
}

function isType({ type }, matchedType) {
  if (isArray(matchedType)) {
    const pattern = matchedType.join('|');
    const regex = new RegExp(pattern);
    return regex.test(type);
  }

  return type === matchedType;
}

function isMatchingRecord(record, medicationOrderId, provider) {
  return (
    (!medicationOrderId || isMatchingMedicationOrderId(record, medicationOrderId))
    && (!provider || isMatchingProvider(record, provider))
  );
}

function isMatchingMedicationOrderId(record, medicationOrderId) {
  const regex = new RegExp(medicationOrderId, 'i');
  return regex.test(record.medicationOrderId);
}

function isMatchingProvider(record, provider) {
  const regex = new RegExp(provider, 'i');
  return regex.test(record.provider);
}
