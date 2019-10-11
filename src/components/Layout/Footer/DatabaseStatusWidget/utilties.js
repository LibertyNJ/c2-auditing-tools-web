export function getTextClassName(databaseStatus) {
  switch (databaseStatus) {
    case 'Ready':
      return 'text-success';
    case 'Error':
    case 'Unknown':
      return 'text-danger';
    default:
      return 'text-warning';
  }
}

export function isDatabaseBusy(databaseStatus) {
  return (
    !isDatabaseReady(databaseStatus)
    && !isDatabaseInError(databaseStatus)
    && !isDatabaseStatusUnknown(databaseStatus)
  );
}

function isDatabaseReady(databaseStatus) {
  return databaseStatus === 'Ready';
}

function isDatabaseInError(databaseStatus) {
  return databaseStatus === 'Error';
}

function isDatabaseStatusUnknown(databaseStatus) {
  return databaseStatus === 'Unknown';
}
