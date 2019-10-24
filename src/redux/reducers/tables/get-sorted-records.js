export default function getSortedRecords(records, sortBy, sortDirection) {
  sortRecords(records, sortBy);
  return isSortDirectionAscending(sortDirection) ? records : records.reverse();
}

function sortRecords(records, sortBy) {
  records.sort((recordA, recordB) => compareRecords(recordA, recordB, sortBy));
}

function compareRecords(recordA, recordB, compareBy) {
  const valueA = getComparedValue(recordA, compareBy);
  const valueB = getComparedValue(recordB, compareBy);
  return isNumber(valueA) || isNumber(valueB)
    ? compareByNumber(valueA, valueB)
    : compareByLetter(valueA, valueB);
}

function getComparedValue(record, name) {
  return isNull(record[name]) ? '' : record[name];
}

function isNull(value) {
  return value === null;
}

function isNumber(value) {
  return typeof value === 'number';
}

function compareByNumber(valueA, valueB) {
  return valueA - valueB;
}

function compareByLetter(valueA, valueB) {
  const DECREASE_ELEMENT_A_INDEX = -1;
  const INCREASE_ELEMENT_A_INDEX = 1;
  const NO_CHANGE = 0;
  if (isInLexicalOrder(valueA, valueB)) {
    return DECREASE_ELEMENT_A_INDEX;
  }
  if (isInLexicalOrder(valueB, valueA)) {
    return INCREASE_ELEMENT_A_INDEX;
  }
  return NO_CHANGE;
}

function isInLexicalOrder(valueA, valueB) {
  return valueA.toUpperCase() < valueB.toUpperCase();
}

function isSortDirectionAscending(sortDirection) {
  return sortDirection === 'ASC';
}
