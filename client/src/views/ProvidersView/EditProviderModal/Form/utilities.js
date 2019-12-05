'use-strict';

export function getSelectedOptionValues(selectElement) {
  return [...selectElement.selectedOptions].map(extractValue);
}

function extractValue({ value }) {
  return value;
}

export function isEmptyArray({ length }) {
  return length === 0;
}

export function isSelectElement({ tagName }) {
  return tagName === 'SELECT';
}
