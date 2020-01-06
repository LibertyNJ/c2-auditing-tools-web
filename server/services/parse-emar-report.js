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

function parseWorksheet(worksheet) {
  const data = [];
  worksheet.eachRow((row, rowNumber) => parseRow(row, rowNumber, data));

  return data;
}

function parseRow(row, rowNumber, data) {
  if (isPastHeaderRow(rowNumber)) {
    const rowValues = getRowValues(row);
    data.push(rowValues);
  }
}

function isPastHeaderRow(rowNumber) {
  const HEADER_ROW_NUMBER = 1;
  return rowNumber > HEADER_ROW_NUMBER;
}

function getRowValues(row) {
  const medName = row.getCell('P').value;
  const genericName = row.getCell('O').value;
  const performedDate = row.getCell('AM').value;
  const medOrderDose = row.getCell('R').value;
  const [dose, units] = medOrderDose.split(/\s/);

  return {
    dose,
    emarUsernameValue: row.getCell('AP').value,
    form: getForm(medName),
    isNonMedAdminTask: row.getCell('Q').value,
    medName,
    medicalRecordNumber: row.getCell('G').value,
    medicationName: getMedicationName(genericName),
    medicationOrderId: row.getCell('M').value,
    date: createTimestamp(performedDate),
    units: getUnits(units),
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
  console.log(month, day, year);
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
