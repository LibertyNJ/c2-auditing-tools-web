'use-strict';

export default function getCellData({ dataKey, rowData }) {
  const cellData = rowData[dataKey];

  if (isTimestamp(dataKey) && !isNull(cellData)) {
    return formatTimestamp(cellData);
  }

  return cellData;
}

function isTimestamp(dataKey) {
  return /timestamp/i.test(dataKey);
}

function formatTimestamp(isoString) {
  const DATE_FORMAT = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  return new Date(isoString).toLocaleString('en-US', DATE_FORMAT);
}

function isNull(value) {
  return value === null;
}
