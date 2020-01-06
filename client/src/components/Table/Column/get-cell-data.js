export default function getCellData({ dataKey, rowData }) {
  const cellData = rowData[dataKey];

  if (isDate(dataKey) && !isNull(cellData)) {
    return formatDate(cellData);
  }

  return cellData;
}

function isDate(dataKey) {
  return /date/i.test(dataKey);
}

function formatDate(isoString) {
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
