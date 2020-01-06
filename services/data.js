let _database;

module.exports = function createProviders(database) {
  _database = database;
  try {
    const providerEmars = selectProviderEmars();
    providerEmars.forEach(createProvider);
  } catch (error) {
    throw error;
  }
};

function selectProviderEmars() {
  return _database.read({ table: 'providerEmar' });
}

function createProvider(providerEmar) {
  if (!isAssignedProviderId(providerEmar)) {
    insertProviderAndUpdateProviderNames(providerEmar);
  }
}

function isAssignedProviderId({ providerId }) {
  return !!providerId;
}

function insertProviderAndUpdateProviderNames(providerEmar) {
  const providerName = getProviderName(providerEmar);
  insertProvider(providerName);

  const providerId = selectProviderId(providerName);
  updateProviderEmar(providerEmar, providerId);
  updateProviderAdc(providerName, providerId);
}

function getProviderName({ name }) {
  const [lastName, firstName, middleInitial] = splitNames(name);
  return { lastName, firstName, middleInitial };
}

function splitNames(name) {
  const [lastName, remainder] = name.split(', ');
  const middleInitial = hasMiddleInitial(remainder) ? extractMiddleInitial(remainder) : null;
  const firstName = middleInitial ? extractFirstName(remainder) : remainder;
  return [lastName, firstName, middleInitial];
}

function hasMiddleInitial(remainder) {
  return /\s\w$/.test(remainder);
}

function extractMiddleInitial(remainder) {
  return remainder.match(/\w$/)[0];
}

function extractFirstName(remainder) {
  const MIDDLE_INITIAL_LENGTH = 2;
  const firstNameLength = remainder.length - MIDDLE_INITIAL_LENGTH;
  const FIRST_NAME_START = 0;
  return remainder.slice(FIRST_NAME_START, firstNameLength);
}

function insertProvider({ firstName, lastName, middleInitial = null }) {
  _database.create({
    data: { firstName, lastName, middleInitial },
    onConflict: 'IGNORE',
    table: 'provider',
  });
}

function selectProviderId({ firstName, lastName, middleInitial = null }) {
  const result = _database.read({
    columns: ['id'],
    predicates: [
      { column: 'firstName', operator: 'LIKE', value: firstName },
      { column: 'lastName', operator: 'LIKE', value: lastName },
      { column: 'middleInitial', operator: 'IS', value: middleInitial },
    ],
    table: 'provider',
  });
  return result[0].id || null;
}

function updateProviderEmar({ id }, providerId) {
  _database.update({
    data: { providerId },
    predicates: [{ column: 'id', operator: '=', value: id }],
    table: 'providerEmar',
  });
}

function updateProviderAdc({ lastName, firstName }, providerId) {
  const providerAdcName = createProviderAdcName(lastName, firstName);
  _database.update({
    data: { providerId },
    predicates: [{ column: 'name', operator: 'LIKE', value: providerAdcName }],
    table: 'providerAdc',
  });
}

function createProviderAdcName(lastName, firstName) {
  return `${lastName}, ${firstName}`;
}

const Excel = require('exceljs');
const fs = require('fs');

const { getForm, getMedicationName, getUnits } = require('./util');
const ignoredProducts = require('../../../config/ignored-products');

let _database;

module.exports = async function importC2ActivityReport(database, filePath) {
  _database = database;
  try {
    await importC2Activity(filePath);
  } catch (error) {
    throw error;
  }
};

async function importC2Activity(filePath) {
  const readStream = fs.createReadStream(filePath);
  const worksheet = await getWorksheet(readStream);
  importWorksheet(worksheet);
  readStream.close();
}

async function getWorksheet(readStream) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.read(readStream);
  return workbook.getWorksheet(1);
}

function importWorksheet(worksheet) {
  worksheet.eachRow((row, rowNumber) => processRow(row, rowNumber));
}

function processRow(row, rowNumber) {
  const medDescription = row.getCell('C').value;
  if (
    isPastHeaderRow(rowNumber)
    && isTrackedMedication(medDescription)
    && !isIgnoredProduct(medDescription)
  ) {
    const parsedRow = parseRow(row);
    importRow(parsedRow);
  }
}

function isPastHeaderRow(rowNumber) {
  const HEADER_ROW_NUMBER = 11;
  return rowNumber > HEADER_ROW_NUMBER;
}

function parseRow(row) {
  const medDescription = row.getCell('C').value;
  const orderId = row.getCell('J').value;
  const transaction = row.getCell('E').value;
  const transactionDate = row.getCell('A').value;
  const transactionTime = row.getCell('B').value;

  return {
    adcTransactionTypeName: getAdcTransactionTypeName(transaction),
    amount: row.getCell('D').value,
    form: getForm(medDescription),
    medicalRecordNumber: +row.getCell('I').value || null,
    medicationOrderId: getMedicationOrderId(orderId),
    medicationProductAdcName: medDescription,
    providerAdcName: row.getCell('K').value,
    strength: /hycodan/i.test(medDescription) ? 5.0 : +row.getCell('O').value, // Tests for special case of hycodan, which does not have an indicated strength in Pyxis database.
    timestamp: createTimestamp(transactionDate, transactionTime),
    units: getUnits(medDescription),
    waste: row.getCell('F').value,
  };
}

function getAdcTransactionTypeName(transaction) {
  switch (transaction) {
    case 'WITHDRAWN':
      return 'Withdrawal';
    case 'RESTOCKED':
      return 'Restock';
    case 'RETURNED':
      return 'Return';
    default:
      return 'Other';
  }
}

function getMedicationOrderId(orderId) {
  switch (orderId) {
    case 'OVERRIDE':
      return 'OVERRIDE';
    case ' ':
      return null;
    default:
      return orderId.slice(1);
  }
}

function createTimestamp(date, time) {
  const [month, day, year] = date.split(/\//);
  return `${year}-${month}-${day}T${time}`;
}

function isTrackedMedication(medicationProductAdcName) {
  const regex = /fentanyl|oxycodone|hydromorphone|morphine|hydrocodone\/homatrop/i;
  return regex.test(medicationProductAdcName);
}

function isIgnoredProduct(medDescription) {
  return ignoredProducts.find(ignoredProduct => ignoredProduct === medDescription);
}

function importRow(row) {
  insertProviderAdc(row);
  insertMedicationProductAdc(row);
  const medicationId = getMedicationId(row);
  insertMedicationProduct(row, medicationId);
  if (hasMedicationOrderId(row)) {
    insertMedicationOrder(row, medicationId);
  }
  if (isTrackedTransactionType(row)) {
    insertAdcTransaction(row);
  }
  if (hasWaste(row)) {
    insertWasteAdcTransaction(row);
  }
}

function hasMedicationOrderId({ medicationOrderId }) {
  return medicationOrderId !== null && medicationOrderId !== 'OVERRIDE';
}

function isTrackedTransactionType({ adcTransactionTypeName }) {
  return /Restock|Return|Withdrawal/.test(adcTransactionTypeName);
}

function insertProviderAdc({ providerAdcName }) {
  _database.create({
    data: {
      name: providerAdcName,
    },
    onConflict: 'IGNORE',
    table: 'providerAdc',
  });
}

function insertMedicationProductAdc({ medicationProductAdcName }) {
  _database.create({
    data: {
      name: medicationProductAdcName,
    },
    onConflict: 'IGNORE',
    table: 'medicationProductAdc',
  });
}

function getMedicationId({ medicationProductAdcName }) {
  const medicationName = getMedicationName(medicationProductAdcName);
  return selectIdByName('medication', medicationName);
}

function insertMedicationOrder({ medicationOrderId }, medicationId) {
  _database.create({
    data: {
      id: medicationOrderId,
      medicationId,
    },
    onConflict: 'IGNORE',
    table: 'medicationOrder',
  });
}

function insertMedicationProduct(
  {
    form, medicationProductAdcName, strength, units,
  },
  medicationId,
) {
  _database.create({
    data: {
      adcId: selectIdByName('medicationProductAdc', medicationProductAdcName),
      form,
      medicationId,
      strength,
      units,
    },
    onConflict: 'IGNORE',
    table: 'medicationProduct',
  });
}

function insertAdcTransaction({
  adcTransactionTypeName,
  amount,
  medicalRecordNumber,
  medicationOrderId,
  medicationProductAdcName,
  providerAdcName,
  timestamp,
}) {
  _database.create({
    data: {
      amount,
      medicalRecordNumber,
      medicationOrderId,
      medicationProductId: selectMedicationProductIdByAdcName(medicationProductAdcName),
      providerAdcId: selectIdByName('providerAdc', providerAdcName),
      timestamp,
      typeId: selectIdByName('adcTransactionType', adcTransactionTypeName),
    },
    onConflict: 'IGNORE',
    table: 'adcTransaction',
  });
}

function selectMedicationProductIdByAdcName(adcName) {
  const adcId = selectIdByName('medicationProductAdc', adcName);
  const result = _database.read({
    columns: ['id'],
    predicates: [{ column: 'adcId', operator: '=', value: adcId }],
    table: 'medicationProduct',
  });
  return result[0].id || null;
}

function hasWaste({ waste = '' }) {
  return /AMT WASTED/.test(waste);
}

function insertWasteAdcTransaction({
  medicalRecordNumber,
  medicationOrderId,
  medicationProductAdcName,
  providerAdcName,
  timestamp,
  waste,
}) {
  _database.create({
    data: {
      amount: getWasteAmount(waste),
      medicalRecordNumber,
      medicationOrderId,
      medicationProductId: selectMedicationProductIdByAdcName(medicationProductAdcName),
      providerAdcId: selectIdByName('providerAdc', providerAdcName),
      timestamp,
      typeId: selectIdByName('adcTransactionType', 'Waste'),
    },
    onConflict: 'IGNORE',
    table: 'adcTransaction',
  });
}

function getWasteAmount(waste) {
  return waste.split(/\s/)[2];
}

function selectIdByName(table, name) {
  const result = _database.read({
    columns: ['id'],
    predicates: [{ column: 'name', operator: '=', value: name }],
    table,
  });
  return result[0].id || null;
}

const Excel = require('exceljs');
const fs = require('fs');

const { getForm, getMedicationName, getUnits } = require('./util');

let _database;

module.exports = async function importMedicationOrderTaskStatusDetailReport(database, filePath) {
  _database = database;
  try {
    await importMedicationOrderTaskStatusDetail(filePath);
  } catch (error) {
    throw error;
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
  const options = {
    map(value, index) {
      switch (index) {
        case 5:
          return +value;
        case 6:
          return +value;
        default:
          return value;
      }
    },
  };
  return workbook.csv.read(readStream, options);
}

function importWorksheet(worksheet) {
  worksheet.eachRow(processRow);
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
  const dischargeDate = row.getCell('L').value;
  const medName = row.getCell('P').value;
  const genericName = row.getCell('O').value;
  const performedDate = row.getCell('AM').value;
  const medOrderDose = row.getCell('R').value;
  const [dose, units] = medOrderDose.split(/\s/);

  return {
    discharged: /\S/.test(dischargeDate) ? createTimestamp(dischargeDate) : null,
    dose,
    form: getForm(medName),
    isNonMedAdminTask: row.getCell('Q').value,
    medName,
    medicalRecordNumber: row.getCell('G').value,
    medicationName: getMedicationName(genericName),
    medicationOrderId: row.getCell('M').value,
    providerEmarName: row.getCell('AP').value,
    timestamp: createTimestamp(performedDate),
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
  return [year, padTwoLeadingZeros(month), padTwoLeadingZeros(day)];
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
  insertVisit(row);
  insertMedicationOrder(row);
  insertProviderEmar(row);
  const providerEmarId = selectIdByName('providerEmar', row.providerEmarName);
  if (isAdministration(row)) {
    insertEmarAdministration(row, providerEmarId);
  } else if (isPainReassessment(row)) {
    insertEmarPainReassessment(row, providerEmarId);
  }
}

function isAdministration({ isNonMedAdminTask }) {
  return isNonMedAdminTask === 'N';
}

function isPainReassessment({ medName }) {
  return /^Reassess Pain Response/.test(medName);
}

function insertVisit({ discharged, medicalRecordNumber, visitId }) {
  _database.create({
    data: { discharged, medicalRecordNumber, id: visitId },
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
    onConflict: 'REPLACE',
    table: 'medicationOrder',
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
  const result = _database.read({
    columns: ['id'],
    predicates: [{ column: 'name', operator: '=', value: name }],
    table,
  });
  return result[0].id || null;
}
