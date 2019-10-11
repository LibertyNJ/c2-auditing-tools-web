'use-strict';

const { handleError } = require('../../utilities');
const createProviders = require('./create-providers');
const importC2ActivityReport = require('./import-c2-activity-report');
const importMedicationOrderTaskStatusDetailReport = require('./import-medication-order-task-status-detail-report');

module.exports = function importData(
  database,
  { c2ActivityReportPath, medicationOrderTaskStatusDetailReportPath },
) {
  try {
    importC2ActivityReport(database, c2ActivityReportPath);
    importMedicationOrderTaskStatusDetailReport(
      database,
      medicationOrderTaskStatusDetailReportPath,
    );
    createProviders(database);
  } catch (error) {
    handleError(error);
  }
};
