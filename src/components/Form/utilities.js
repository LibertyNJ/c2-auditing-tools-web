'use-strict';

export function getSelectedOptionValues(selectElement) {
  return [...selectElement.selectedOptions].map(extractValue);
}

function extractValue({ value }) {
  return value;
}

export function isSelectElement({ tagName }) {
  return tagName === 'SELECT';
}
