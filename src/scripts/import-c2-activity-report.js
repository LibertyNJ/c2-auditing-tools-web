'use-strict';

const fs = require('fs');

const Excel = require('exceljs/modern.nodejs');

const db = require('./db');

export default async function importC2ActivityReport(filePath) {
  const readStream = fs.createReadStream(filePath);
  const worksheet = await getWorksheet(readStream);
  worksheet.eachRow(row => importRow(row));
  readStream.close();
}

async function getWorksheet(readStream) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.read(readStream);
  const worksheet = workbook.getWorksheet(1);
  return worksheet;
}

function importRow(row) {
  const parsedRow = parseRow(row);
  createRecords(parsedRow);
}

function parseRow(row) {
  const transaction = row.getCell('E').value;
  const transactionDate = row.getCell('A').value;
  const transactionTime = row.getCell('B').value;

  const parsedRow = {
    adcTransactionTypeName: getAdcTransactionTypeName(transaction),
    amount: row.getCell('D').value,
    medicalRecordNumber: +row.getCell('I').value,
    medicationOrderId: row.getCell('J').value,
    medicationProductAdcName: row.getCell('C').value,
    providerAdcName: row.getCell('K').value,
    strength: row.getCell('O').value,
    timestamp: createTimestamp(transactionDate, transactionTime),
    waste: row.getCell('F').value,
  };

  return parsedRow;
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
      throw new Error('Invalid transaction.');
  }
}

function createTimestamp(date, time) {
  const [month, day, year] = date.split(/\//);
  const timestamp = `${year}-${month}-${day}T${time}`;
  return timestamp;
}

function createRecords(parsedRow) {
  createProviderAdc(parsedRow);
  createMedicationProductAdc(parsedRow);
  createMedicationProduct(parsedRow);
  createMedicationOrder(parsedRow);
  createAdcTransaction(parsedRow);
}

function createProviderAdc({ providerAdcName }) {
  db.create('providerAdc', {
    onConflict: 'ignore',
    data: { name: providerAdcName },
  });
}

function createMedicationProductAdc({ medicationProductAdcName }) {
  db.create('medicationProductAdc', {
    onConflict: 'ignore',
    data: { name: medicationProductAdcName },
  });
}

function createMedicationProduct({
  medicationId, strength, units, form, medicationProductAdcId,
}) {
  db.create('medicationProduct', {
    onConflict: 'ignore',
    data: {
      medicationId,
      strength,
      units,
      form,
      adcId: medicationProductAdcId,
    },
  });
}

function createMedicationOrder({ medicationOrderId, medicationId }) {
  db.create('medicationOrder', {
    onConflict: 'ignore',
    data: {
      id: medicationOrderId,
      medicationId,
    },
  });
}

function createAdcTransaction({
  adcTransactionTypeId,
  providerAdcId,
  medicationOrderId,
  medicationProductId,
  amount,
  medicalRecordNumber,
  timestamp,
}) {
  db.create('adcTransaction', {
    onConflict: 'ignore',
    data: {
      typeId: adcTransactionTypeId,
      providerAdcId,
      medicationOrderId,
      medicationProductId,
      amount,
      medicalRecordNumber,
      timestamp,
    },
  });
}
