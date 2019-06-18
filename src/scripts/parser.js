const fs = require('fs');

const Excel = require('exceljs');

const getMedicationName = string => {
  if (/oxycodone/i.test(string)) {
    if (/acetaminophen/i.test(string)) {
      return 'Oxycodone–Acetaminophen';
    }

    return 'Oxycodone';
  }

  if (/hydromorphone/i.test(string)) {
    return 'Hydromorphone';
  }

  if (/morphine/i.test(string)) {
    return 'Morphine';
  }

  if (/fentanyl/i.test(string)) {
    return 'Fentanyl';
  }

  if (/hydrocodone/i.test(string) && /homatrop/i.test(string)) {
    return 'Hydrocodone–Homatropine';
  }

  return null;
};

const getUnits = string => {
  if (/milligram|cup/i.test(string)) {
    return 'mG';
  }

  if (/microgram/i.test(string)) {
    if (/kg\/hr/i.test(string)) {
      return 'mCg/kG/Hr';
    }

    return 'mCg';
  }

  if (/mg\/hr/i.test(string)) {
    return 'mG/Hr';
  }

  if (/tablet/i.test(string)) {
    return 'tablet';
  }

  if (/patch/i.test(string)) {
    return 'patch';
  }

  return null;
};

const getForm = string => {
  if (/tablet/i.test(string)) {
    if (/[^a-zA-Z]ER[^a-zA-Z]/.test(string)) {
      return 'ER Tablet';
    }

    return 'Tablet';
  }

  if (/[^a-zA-Z]ir[^a-zA-Z]|oxycodone.*acetaminophen/i.test(string)) {
    return 'Tablet';
  }

  if (/capsule/i.test(string)) {
    return 'Capsule';
  }

  if (/cup|syrup|solution|liquid/i.test(string)) {
    return 'Cup';
  }

  if (/vial/i.test(string)) {
    return 'Vial';
  }

  if (/injectable/i.test(string)) {
    return 'Injectable';
  }

  if (/ampule/i.test(string)) {
    return 'Ampule';
  }

  if (/patch/i.test(string)) {
    return 'Patch';
  }

  if (/bag|infusion|ivbp/i.test(string)) {
    return 'Bag';
  }

  if (/syringe|tubex|pca/i.test(string)) {
    return 'Syringe';
  }

  if (/concentrate/i.test(string)) {
    return 'Concentrate';
  }

  return null;
};

const getAdcTransactionType = string => {
  switch (string) {
    case 'WITHDRAWN':
      return 'Withdrawal';
    case 'RESTOCKED':
      return 'Restock';
    case 'RETURNED':
      return 'Return';
    default:
      return null;
  }
};

module.exports = {
  createProviders(db) {
    return new Promise((resolve, reject) => {
      try {
        const providerEmars = db.read('providerEmar', {
          isDistinct: true,
          columns: ['id', 'name', 'providerId'],
          wheres: [],
        });

        providerEmars.forEach(({ id, name, providerId }) => {
          if (providerId) return;

          const [lastName, remainder] = name.split(', ');
          const middleInitial = /\s\w$/.test(remainder)
            ? remainder.match(/\w$/)[0]
            : null;
          const firstName = middleInitial
            ? remainder.slice(0, remainder.length - 2)
            : remainder;

          db.create('provider', {
            onConflict: 'ignore',
            data: {
              lastName,
              firstName,
              middleInitial,
            },
          });

          const newProviderId = db.read('provider', {
            columns: ['id'],
            wheres: [
              {
                column: 'lastName',
                operator: '=',
                value: lastName,
              },
              {
                column: 'firstName',
                operator: '=',
                value: firstName,
              },
              {
                column: 'middleInitial',
                operator: 'IS',
                value: middleInitial,
              },
            ],
          });

          db.update('providerEmar', {
            sets: [
              {
                column: 'providerId',
                value: newProviderId,
              },
            ],
            wheres: [
              {
                column: 'id',
                operator: '=',
                value: id,
              },
            ],
          });

          db.update('providerAdc', {
            sets: [
              {
                column: 'providerId',
                value: newProviderId,
              },
            ],
            wheres: [
              {
                column: 'name',
                operator: '=',
                value: `${lastName.toUpperCase()}, ${firstName.toUpperCase()}`,
              },
            ],
          });
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  parseAdc(db, filePath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath);
      const workbook = new Excel.Workbook();

      workbook.xlsx
        .read(readStream)
        .then(() => {
          const worksheet = workbook.getWorksheet(1);
          let isPastHeaderRow = false;

          worksheet.eachRow(row => {
            const adcTransactionType = getAdcTransactionType(
              row.getCell('E').value
            );
            const medicationName = getMedicationName(row.getCell('C').value);
            const medicationId = getMedicationId(medicationName);

            function getMedicationId(medicationName) {
              db.read('medication', {
                columns: ['id'],
                wheres: [
                  {
                    column: 'name',
                    operator: '=',
                    value: medicationName,
                  },
                ],
              });
            }

            if (isPastHeaderRow && medicationId && adcTransactionType) {
              const timestamp = getTimestamp(
                row.getCell('A').value,
                row.getCell('B').value
              );

              const medicationProductAdc = row.getCell('C').value;
              const form = getForm(medicationProductAdc);
              const units = getUnits(medicationProductAdc);
              const amount = row.getCell('D').value;
              const mrn = +row.getCell('I').value;

              const medicationOrderId =
                row.getCell('J').value === 'OVERRIDE'
                  ? 'OVERRIDE'
                  : row.getCell('J').value.slice(1);

              const strength = /hycodan/i.test(medicationProductAdc) // Tests for special case of hycodan, which does not have an indicated strength in current Pyxis database.
                ? 5.0
                : row.getCell('O').value;

              db.create('providerAdc', {
                onConflict: 'ignore',
                data: { name: row.getCell('K').value },
              });

              const providerAdcId = getProviderAdcId(row.getCell('K').value);

              function getProviderAdcId(providerAdcName) {
                db.read('providerAdc', {
                  columns: ['id'],
                  wheres: [
                    {
                      column: 'name',
                      operator: '=',
                      value: providerAdcName,
                    },
                  ],
                });
              }

              db.create('medicationProductAdc', {
                onConflict: 'ignore',
                data: { name: medicationProductAdc },
              });

              const medicationProductAdcId = getMedicationProductAdcId(
                medicationProductAdc
              );

              function getMedicationProductAdcId(medicationProductAdcName) {
                db.read('medicationProductAdc', {
                  columns: ['id'],
                  wheres: [
                    {
                      column: 'name',
                      operator: '=',
                      value: medicationProductAdcName,
                    },
                  ],
                });
              }

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

              const medicationProductId = db.read('medicationProduct', {
                columns: ['id'],
                wheres: [
                  {
                    column: 'adcId',
                    operator: '=',
                    value: medicationProductAdcId,
                  },
                ],
              });

              db.create('medicationOrder', {
                onConflict: 'ignore',
                data: {
                  id: medicationOrderId,
                  medicationId,
                },
              });

              const adcTransactionTypeId = db.read('adcTransactionType', {
                columns: ['id'],
                wheres: [
                  {
                    column: 'name',
                    operator: '=',
                    value: adcTransactionType,
                  },
                ],
              });

              db.create('adcTransaction', {
                onConflict: 'ignore',
                data: {
                  typeId: adcTransactionTypeId,
                  providerAdcId,
                  medicationOrderId,
                  medicationProductId,
                  amount,
                  mrn,
                  timestamp,
                },
              });

              if (/WASTED/.test(row.getCell('F').value)) {
                const amountWasted = row.getCell('F').value.split(/\s/)[2];

                const adcWasteTypeId = db.read('adcTransactionType', {
                  columns: ['id'],
                  wheres: [
                    {
                      column: 'name',
                      operator: '=',
                      value: 'Waste',
                    },
                  ],
                });

                db.create('adcTransaction', {
                  onConflict: 'ignore',
                  data: {
                    typeId: adcWasteTypeId,
                    providerAdcId,
                    medicationOrderId,
                    medicationProductId,
                    amount: amountWasted,
                    timestamp,
                  },
                });
              }
            }

            if (row.getCell('A').value === 'TRANSACTIONDATE') {
              isPastHeaderRow = true;
            }
          });

          const getTimestamp = (date, time) => {
            const [month, day, year] = date.split(/\//);
            return `${year}-${month}-${day}T${time}`;
          };
        })
        .then(() => {
          readStream.close();
          resolve();
        })
        .catch(error => reject(error));
    });
  },

  parseEmar(db, filePath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath);
      const workbook = new Excel.Workbook();

      workbook.csv
        .read(readStream)
        .then(worksheet => {
          const getTimestamp = string => {
            if (!string) return null;

            const [date, time, meridian] = string.split(/\s/);

            let [month, day, year] = date.split(/\//);
            month = month.toString().padStart(2, '0');
            day = day.toString().padStart(2, '0');

            let [hours, minutes] = time.split(/:/);

            if (meridian === 'PM' && hours !== '12') {
              hours = (+hours + 12).toString();
            } else if (meridian === 'AM' && hours === '12') {
              hours = '00';
            } else {
              hours = hours.toString().padStart(2, '0');
            }

            return `${year}-${month}-${day}T${hours}:${minutes}:00`;
          };

          let isPastHeaderRow = false;
          worksheet.eachRow(row => {
            if (isPastHeaderRow) {
              const visitId = row.getCell('F').value;
              const mrn = +row.getCell('G').value;
              const discharged = getTimestamp(row.getCell('L').value);

              db.create('visit', {
                onConflict: 'replace',

                data: {
                  id: visitId,
                  mrn,
                  discharged,
                },
              });

              const medicationOrderId = row.getCell('M').value;
              const [dose, rawUnits] = row.getCell('R').value.split(/\s/);
              const units = getUnits(rawUnits);
              const form = getForm(row.getCell('P').value);

              const medicationId = db.read('medication', {
                columns: ['id'],

                wheres: [
                  {
                    column: 'name',
                    operator: '=',
                    value: getMedication(row.getCell('O').value),
                  },
                ],
              });

              db.create('medicationOrder', {
                onConflict: 'replace',
                data: {
                  id: medicationOrderId,
                  medicationId,
                  dose,
                  units,
                  form,
                  visitId,
                },
              });

              db.create('providerEmar', {
                onConflict: 'ignore',
                data: {
                  name: row.getCell('AP').value,
                },
              });

              const providerEmarId = db.read('providerEmar', {
                columns: ['id'],
                wheres: [
                  {
                    column: 'name',
                    operator: '=',
                    value: row.getCell('AP').value,
                  },
                ],
              });

              const timestamp = getTimestamp(row.getCell('AM').value);

              if (row.getCell('Q').value === 'Y') {
                if (/Reassess Pain Response/.test(row.getCell('P').value)) {
                  const byPolicy = row.getCell('AO').value === 'Y' ? 1 : 0;

                  db.create('emarPainAssessment', {
                    onConflict: 'ignore',
                    data: {
                      providerEmarId,
                      medicationOrderId,
                      byPolicy,
                      timestamp,
                    },
                  });
                }
              } else {
                db.create('emarAdministration', {
                  onConflict: 'ignore',
                  data: { providerEmarId, medicationOrderId, timestamp },
                });
              }
            }

            if (row.getCell('A').value === 'FacilityName') {
              isPastHeaderRow = true;
            }
          });

          readStream.close();
          resolve();
        })
        .catch(error => reject(error));
    });
  },
};
