'use-strict';

export default function sort(records, sortBy) {
  records.sort((recordA, recordB) => {
    const valueA = getValue(recordA, sortBy);
    const valueB = getValue(recordB, sortBy);

    if (isNumber(valueA) || isNumber(valueB)) {
      return sortByNumericalOrder(valueA, valueB);
    }

    return sortByAlphabeticalOrder(valueA, valueB);
  });
}

function getValue(record, sortBy) {
  return isNull(record[sortBy]) ? '' : record[sortBy];
}

function isNull(value) {
  return value === null;
}

function isNumber(value) {
  return typeof value === 'number';
}

function sortByNumericalOrder(valueA, valueB) {
  return valueA - valueB;
}

function sortByAlphabeticalOrder(valueA, valueB) {
  const DECREASE_ELEMENT_A_INDEX = -1;
  const INCREASE_ELEMENT_A_INDEX = 1;
  const NO_CHANGE = 0;

  if (isInAlphabeticalOrder(valueA, valueB)) {
    return DECREASE_ELEMENT_A_INDEX;
  }

  if (isInAlphabeticalOrder(valueB, valueA)) {
    return INCREASE_ELEMENT_A_INDEX;
  }

  return NO_CHANGE;
}

function isInAlphabeticalOrder(valueA, valueB) {
  return valueA.toUpperCase() < valueB.toUpperCase();
}
