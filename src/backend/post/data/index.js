const createProviders = require('./create-providers');
const importC2ActivityReport = require('./import-c2-activity-report');
const importMedicationOrderTaskStatusDetailReport = require('./import-medication-order-task-status-detail-report');
const { createResponse } = require('../../utilities');

module.exports = async function importData(
  database,
  { c2ActivityReportPath, medicationOrderTaskStatusDetailReportPath },
) {
  try {
    await Promise.all(
      importC2ActivityReport(database, c2ActivityReportPath),
      importMedicationOrderTaskStatusDetailReport(
        database,
        medicationOrderTaskStatusDetailReportPath,
      ),
    );
    createProviders(database);
    return createResponse('post', 'OK', { resource: 'data' });
  } catch (error) {
    return createResponse('post', 'ERROR', { error });
  }
};
