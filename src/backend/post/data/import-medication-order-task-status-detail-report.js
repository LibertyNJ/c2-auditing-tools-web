const Excel = require('exceljs');
const fs = require('fs');

const {
  getForm, getMedicationName, getUnits, handleError,
} = require('../../utilities');

let _database;

module.exports = async function importMedicationOrderTaskStatusDetailReport(database, filePath) {
  _database = database;
  try {
    await importMedicationOrderTaskStatusDetail(filePath);
  } catch (error) {
    handleError(error);
  }
};

async function importMedicationOrderTaskStatusDetail(filePath) {
  const readStream = fs.createReadStream(filePath);
  const worksheet = await getWorksheet(readStream);
  importWorksheet(worksheet);
  readStream.close();
}

async function getWorksheet(readStream) {
  const workbook = new Excel.Workbook();
  return workbook.csv.read(readStream);
}

function importWorksheet(worksheet) {
  worksheet.eachRow((row, rowNumber) => processRow(row, rowNumber));
}

function processRow(row, rowNumber) {
  if (isPastHeaderRow(rowNumber)) {
    const parsedRow = parseRow(row);
    importRow(parsedRow);
  }
}

function isPastHeaderRow(rowNumber) {
  const HEADER_ROW_NUMBER = 7;
  return rowNumber > HEADER_ROW_NUMBER;
}

function parseRow(row) {
  const dischargeDtm = row.getCell('L').value;
  const medName = row.getCell('P').value;
  const genericName = row.getCell('O').value;
  const performedDateTime = row.getCell('AM').value;
  const medOrderDose = row.getCell('R').value;
  const [dose, units] = medOrderDose.split(/\s/);

  return {
    discharged: createTimestamp(dischargeDtm),
    dose,
    form: getForm(medName),
    medicalRecordNumber: +row.getCell('G').value,
    medicationName: getMedicationName(genericName),
    medicationOrderId: row.getCell('M').value,
    providerEmarName: row.getCell('AP').value,
    timestamp: createTimestamp(performedDateTime),
    units: getUnits(units),
    visitId: row.getCell('F').value,
  };
}

function createTimestamp(datetime) {
  const [date, time, meridian] = getDatetimeElements(datetime);
  const [year, month, day] = getDateElements(date);
  const [hours, minutes] = getTimeElements(time, meridian);
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function getDatetimeElements(datetime) {
  return datetime.split(/\s/);
}

function getDateElements(date) {
  const [month, day, year] = date.split(/\//);
  return [year, month, day];
}

function getTimeElements(time, meridian) {
  const [hours, minutes] = time.split(/:/);
  const hoursElement = formatHours(hours, meridian);
  const minutesElement = padTwoLeadingZeros(minutes);
  return [hoursElement, minutesElement];
}

function formatHours(hours, meridian) {
  if (isPastNoon(hours, meridian)) {
    return convertBase12HoursToBase24Hours(hours);
  }

  if (isMidnight(hours, meridian)) {
    return '00';
  }

  return padTwoLeadingZeros(hours);
}

function isPastNoon(hours, meridian) {
  return hours !== '12' && meridian === 'PM';
}

function convertBase12HoursToBase24Hours(hours) {
  const DIFFERENCE_OF_BASE_24_AND_BASE_12 = 12;
  return (+hours + DIFFERENCE_OF_BASE_24_AND_BASE_12).toString();
}

function isMidnight(hours, meridian) {
  return hours === '12' && meridian === 'AM';
}

function padTwoLeadingZeros(string) {
  return string.padStart(2, '0');
}

function importRow(row) {
  const transaction = _database.transaction(() => {
    insertVisit(row);
    insertMedicationOrder(row);
    insertProviderEmar(row);

    const providerEmarId = selectIdByName('providerEmar', row.providerEmarName);

    if (isAdministration(row)) {
      insertEmarAdministration(row, providerEmarId);
    } else if (isPainReassessment(row)) {
      insertEmarPainReassessment(row, providerEmarId);
    }
  });

  transaction();
}

function isAdministration(row) {
  return row.getCell('Q').value;
}

function isPainReassessment(row) {
  const medName = row.getCell('P').value;
  return /^Reassess Pain Response/.test(medName);
}

function insertVisit({ discharged, medicalRecordNumber, visitId }) {
  _database.create({
    data: { discharged, medicalRecordNumber, visitId },
    onConflict: 'REPLACE',
    table: 'visit',
  });
}

function insertMedicationOrder({
  dose, form, medicationName, medicationOrderId, units, visitId,
}) {
  _database.create({
    data: {
      dose,
      form,
      id: medicationOrderId,
      medicationId: selectIdByName('medication', medicationName),
      units,
      visitId,
    },
    onConflict: 'IGNORE',
    table: 'visit',
  });
}

function insertProviderEmar({ providerEmarName }) {
  _database.create({
    data: { name: providerEmarName },
    onConflict: 'IGNORE',
    table: 'providerEmar',
  });
}

function insertEmarAdministration({ medicationOrderId, timestamp }, providerEmarId) {
  _database.create({
    data: {
      medicationOrderId,
      providerEmarId,
      timestamp,
    },
    onConflict: 'IGNORE',
    table: 'emarAdministration',
  });
}

function insertEmarPainReassessment({ medicationOrderId, timestamp }, providerEmarId) {
  _database.create({
    data: {
      medicationOrderId,
      providerEmarId,
      timestamp,
    },
    onConflict: 'IGNORE',
    table: 'emarPainReassessment',
  });
}

function selectIdByName(table, name) {
  return _database.read({
    columns: ['id'],
    predicates: [{ column: 'name', operator: '=', value: name }],
    table,
  });
}
