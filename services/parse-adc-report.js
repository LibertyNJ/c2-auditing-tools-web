const ExcelJS = require('exceljs');
const fs = require('fs');

const { getForm, getMedicationName, getUnits } = require('./util');

module.exports = async filePath => {
  const readStream = fs.createReadStream(filePath);
  const worksheet = await getWorksheet(readStream);
  const data = parseWorksheet(worksheet);
  readStream.close();

  return data;
};

async function getWorksheet(readStream) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.read(readStream);

  return workbook.getWorksheet(1);
}

function parseWorksheet(worksheet) {
  const data = [];
  worksheet.eachRow((row, rowNumber) => parseRow(row, rowNumber, data));

  return data;
}

function parseRow(row, rowNumber, data) {
  const medDescription = row.getCell('C').value;

  if (isPastHeaderRow(rowNumber) && isTrackedMedication(medDescription)) {
    const rowData = getRowData(row);
    data.push(rowData);
  }
}

function isPastHeaderRow(rowNumber) {
  const HEADER_ROW_NUMBER = 11;
  return rowNumber > HEADER_ROW_NUMBER;
}

function isTrackedMedication(medicationProductAdcName) {
  const regex = /fentanyl|oxycodone|hydromorphone|morphine|hydrocodone\/homatrop/i;
  return regex.test(medicationProductAdcName);
}

function getRowData(row) {
  const medDescription = row.getCell('C').value;
  const orderId = row.getCell('J').value;
  const transaction = row.getCell('E').value;
  const transactionDate = row.getCell('A').value;
  const transactionTime = row.getCell('B').value;

  return {
    adcUsernameValue: row.getCell('K').value,
    amount: row.getCell('D').value,
    date: createTimestamp(transactionDate, transactionTime),
    form: getForm(medDescription),
    medicalRecordNumber: +row.getCell('I').value || null,
    medicationOrderId: getMedicationOrderId(orderId),
    medicationName: getMedicationName(medDescription),
    productDescriptionValue: medDescription,
    strength: /hycodan/i.test(medDescription) ? 5.0 : +row.getCell('O').value, // Tests for special case of hycodan, which does not have an indicated strength in Pyxis database.
    transactionTypeValue: getAdcTransactionTypeName(transaction),
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
