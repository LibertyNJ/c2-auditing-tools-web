const Excel = require('exceljs');
const fs = require('fs');

const {
  getForm, getMedicationName, getUnits, handleError,
} = require('../../utilities');

let _database;

module.exports = async function importC2ActivityReport(database, filePath) {
  _database = database;
  try {
    await importC2Activity(filePath);
  } catch (error) {
    handleError(error);
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

  if (isPastHeaderRow(rowNumber) && isTrackedMedication(medDescription)) {
    const parsedRow = parseRow(row);
    importRow(parsedRow);
  }
}

function isPastHeaderRow(rowNumber) {
  const HEADER_ROW_NUMBER = 1;
  return rowNumber > HEADER_ROW_NUMBER;
}

function parseRow(row) {
  const medDescription = row.getCell('C').value;
  const transaction = row.getCell('E').value;
  const transactionDate = row.getCell('A').value;
  const transactionTime = row.getCell('B').value;

  return {
    adcTransactionTypeName: getAdcTransactionTypeName(transaction),
    amount: row.getCell('D').value,
    form: getForm(medDescription),
    medicalRecordNumber: +row.getCell('I').value,
    medicationOrderId: row.getCell('J').value,
    medicationProductAdcName: medDescription,
    providerAdcName: row.getCell('K').value,
    strength: row.getCell('O').value,
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

function createTimestamp(date, time) {
  const [month, day, year] = date.split(/\//);
  return `${year}-${month}-${day}T${time}`;
}

function isTrackedMedication(medicationProductAdcName) {
  const regex = /fentanyl|oxycodone|hydromorphone|morphine|hydrocodone\/homatrop/i;
  return regex.test(medicationProductAdcName);
}

function importRow(row) {
  const transaction = _database.transaction(() => {
    insertProviderAdc(row);
    insertMedicationProductAdc(row);

    const medicationId = getMedicationId(row);
    insertMedicationOrder(row, medicationId);
    insertMedicationProduct(row, medicationId);

    if (isTrackedTransactionType(row)) {
      insertAdcTransaction(row);
    }

    if (hasWaste(row)) {
      insertWasteAdcTransaction(row);
    }
  });

  transaction();
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
    table: 'medicationProduct',
  });
}

function selectMedicationProductIdByAdcName(adcName) {
  const adcId = selectIdByName('medicationProductAdc', adcName);
  return _database.read({
    columns: ['id'],
    predicates: [{ column: 'adcId', operator: '=', value: adcId }],
    table: 'medicationProduct',
  });
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
      typeId: selectIdByName('adcTransactionType', 'waste'),
    },
    onConflict: 'IGNORE',
    table: 'adcTransaction',
  });
}

function getWasteAmount(waste) {
  return waste.split(/\s/)[2];
}

function selectIdByName(table, name) {
  return _database.read({
    columns: ['id'],
    predicates: [{ column: 'name', operator: '=', value: name }],
    table,
  });
}
