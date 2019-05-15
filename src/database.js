const Database = require('better-sqlite3');
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');

const adcTransactionTypes = require('./scripts/adc-transaction-types');
const databaseSchema = require('./scripts/database-schema.js');
const medications = require('./scripts/medications');

const isDevMode = process.execPath.match(/[\\/]electron/);

const databasePath = isDevMode
  ? path.join(__dirname, '..', 'database.db')
  : path.join(__dirname, '..', '..', 'database.db');

const db = isDevMode
  ? new Database(databasePath, { verbose: console.log })
  : new Database(databasePath);

db.create = (table, parameters) => {
  const onConflict = parameters.onConflict
    ? `OR ${parameters.onConflict.toUpperCase()} `
    : '';
  const columns = Object.keys(parameters.data).join(', ');
  const values = Object.values(parameters.data);
  const valuePlaceholders = values.map(() => '?').join(', ');

  db.prepare(
    `
    INSERT ${onConflict}INTO ${table} (${columns})
    VALUES (${valuePlaceholders});   
    `
  ).run(...values);
};

db.read = (table, parameters) => {
  const isDistinct = parameters.isDistinct ? 'DISTINCT ' : '';
  const columns = parameters.columns.join(', ');
  const whereValues = parameters.wheres
    ? parameters.wheres
        .filter(where => where)
        .reduce((flattenedWheres, where) => flattenedWheres.concat(where), [])
        .map(({ value }) => value)
    : null;
  const wheres =
    whereValues.length > 0
      ? `WHERE ${parameters.wheres
          .filter(where => where)
          .map(where => {
            if (Array.isArray(where)) {
              return `(${where
                .map(subWhere => `${subWhere.column} ${subWhere.operator} ?`)
                .join(' OR ')})`;
            }

            if (/timestamp/.test(where.column)) {
              return `strftime('%s', ${where.column}) ${
                where.operator
              } strftime('%s', ?)`;
            }

            return `${where.column} ${where.operator} ?`;
          })
          .join(' AND ')}`
      : '';
  const joins = parameters.joins
    ? parameters.joins
        .map(join => `${join.type} JOIN ${join.table} ON ${join.predicate}`)
        .join(' ')
    : '';
  const orderBys = parameters.orderBys
    ? `ORDER BY ${parameters.orderBys
        .map(({ column, direction }) => `${column} ${direction}`)
        .join(', ')}`
    : '';
  const limit = parameters.limit ? `LIMIT ${parameters.limit}` : '';

  const stmt = db.prepare(
    `
    SELECT ${isDistinct}${columns}
    FROM ${table}
    ${joins}
    ${wheres}
    ${orderBys}
    ${limit};
    `
  );

  if (parameters.columns.length === 1 && /id/i.test(parameters.columns[0])) {
    const record = stmt.get(...whereValues);
    return record ? record.id : null;
  }

  console.log(stmt.all(...whereValues));
  return stmt.all(...whereValues) || null;
};

db.update = (table, parameters) => {
  const onConflict = parameters.onConflict
    ? `OR ${parameters.onConflict.toUpperCase()} `
    : '';
  const setValues = parameters.sets
    ? parameters.sets.filter(set => set).map(({ value }) => value)
    : null;
  const sets =
    setValues.length > 0
      ? `SET ${parameters.sets
          .filter(set => set)
          .map(({ column }) => `${column} = ?`)
          .join(', ')}`
      : '';
  const whereValues = parameters.wheres
    ? parameters.wheres
        .filter(where => where)
        .reduce((flattenedWheres, where) => flattenedWheres.concat(where), [])
        .map(({ value }) => value)
    : null;
  const wheres =
    whereValues.length > 0
      ? `WHERE ${parameters.wheres
          .filter(where => where)
          .map(where => {
            if (Array.isArray(where)) {
              return `(${where
                .map(subWhere => `${subWhere.column} ${subWhere.operator} ?`)
                .join(' OR ')})`;
            }

            if (/timestamp/.test(where.column)) {
              return `strftime('%s', ${where.column}) ${
                where.operator
              } strftime('%s', ?)`;
            }

            return `${where.column} ${where.operator} ?`;
          })
          .join(' AND ')}`
      : '';

  db.prepare(
    `
    UPDATE ${onConflict}${table}
    ${sets}
    ${wheres};
    `
  ).run(...setValues, ...whereValues);
};

db.delete = (table, parameters) => {
  const whereValues = parameters.wheres
    ? parameters.wheres
        .filter(where => where)
        .reduce((flattenedWheres, where) => flattenedWheres.concat(where), [])
        .map(({ value }) => value)
    : null;
  const wheres =
    whereValues.length > 0
      ? `WHERE ${parameters.wheres
          .filter(where => where)
          .map(where => {
            if (Array.isArray(where)) {
              return `(${where
                .map(subWhere => `${subWhere.column} ${subWhere.operator} ?`)
                .join(' OR ')})`;
            }

            if (/timestamp/.test(where.column)) {
              return `strftime('%s', ${where.column}) ${
                where.operator
              } strftime('%s', ?)`;
            }

            return `${where.column} ${where.operator} ?`;
          })
          .join(' AND ')}`
      : '';

  db.prepare(
    `
    DELETE FROM ${table}
    ${wheres};
    `
  ).run(...whereValues);
};

db.updateStatus = status => {
  db.status = status;
  process.send({
    header: { type: 'status' },
    body: db.status,
  });
};

db.createProviders = () =>
  new Promise((resolve, reject) => {
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

db.initialize = () => {
  try {
    db.updateStatus('Initializing…');
    Object.entries(databaseSchema).forEach(([table, parameters]) => {
      const columns = Object.entries(parameters.columns)
        .map(([column, constraint]) => `${column} ${constraint}`)
        .join(', ');
      const unique = parameters.unique
        ? `, UNIQUE (${parameters.unique.columns.join(
            ', ' // Ugly
          )}) ON CONFLICT ${parameters.unique.onConflict.toUpperCase()}`
        : '';

      db.prepare(
        `
        CREATE TABLE IF NOT EXISTS ${table}
        (${columns}${unique});
        `
      ).run();
    });

    medications.forEach(medication => {
      db.create('medication', {
        onConflict: 'ignore',
        data: { name: medication },
      });
    });

    adcTransactionTypes.forEach(adcTransactionType => {
      db.create('adcTransactionType', {
        onConflict: 'ignore',
        data: {
          name: adcTransactionType,
        },
      });
    });

    db.create('medicationOrder', {
      onConflict: 'ignore',
      data: {
        id: 'OVERRIDE',
        medicationId: null,
        dose: null,
        units: null,
        form: null,
        visitId: null,
      },
    });

    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) console.error(error);
    db.updateStatus('Error');
  }
};

db.initialize();

const getMedication = string => {
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

  if (/hydrocodone/i.test(string)) {
    if (/homatrop/i.test(string)) {
      return 'Hydrocodone–Homatropine';
    }

    return null;
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

db.parseAdc = filePath =>
  new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    const workbook = new Excel.Workbook();
    workbook.xlsx
      .read(readStream)
      .then(() => {
        const getTimestamp = (date, time) => {
          const [month, day, year] = date.split(/\//);
          return `${year}-${month}-${day}T${time}`;
        };

        const worksheet = workbook.getWorksheet(1);
        let isPastHeaderRow = false;

        worksheet.eachRow((row, rowNumber) => {
          const adcTransactionType = getAdcTransactionType(
            row.getCell('E').value
          );

          const medicationId = db.read('medication', {
            columns: ['id'],
            wheres: [
              {
                column: 'name',
                operator: '=',
                value: getMedication(row.getCell('C').value),
              },
            ],
          });

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

            const providerAdcId = db.read('providerAdc', {
              columns: ['id'],
              wheres: [
                {
                  column: 'name',
                  operator: '=',
                  value: row.getCell('K').value,
                },
              ],
            });

            db.create('medicationProductAdc', {
              onConflict: 'ignore',
              data: { name: medicationProductAdc },
            });

            const medicationProductAdcId = db.read('medicationProductAdc', {
              columns: ['id'],
              wheres: [
                {
                  column: 'name',
                  operator: '=',
                  value: medicationProductAdc,
                },
              ],
            });

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
      })
      .then(() => {
        readStream.close();
        resolve();
      })
      .catch(error => reject(error));
  });

db.parseEmar = filePath =>
  new Promise((resolve, reject) => {
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
        worksheet.eachRow((row, rowNumber) => {
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
      })
      .then(() => {
        readStream.close();
        resolve();
      })
      .catch(error => reject(error));
  });

process.on('message', data => {
  switch (data.header.type) {
    case 'status':
      if (data.header.response) {
        process.send({
          header: { type: data.header.response },
          body: db.status,
        });
      }

      break;
    case 'import':
      db.updateStatus('Importing data…');

      Promise.all([
        db.parseAdc(data.body.adcPath),
        db.parseEmar(data.body.emarPath),
      ])
        .then(() => db.createProviders())
        .then(() => {
          process.send({ header: { type: data.header.response } });
          db.updateStatus('Ready');
        })
        .catch(error => {
          if (isDevMode) console.error(error);
          db.updateStatus('Error');
        });

      break;
    case 'query':
      try {
        db.updateStatus('Querying…');
        const records = db.read(data.body.table, data.body.parameters);

        if (data.header.response) {
          process.send({
            header: { type: data.header.response },
            body: records,
          });
        }

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) console.error(error);
        db.updateStatus('Error');
      }

      break;

    case 'update':
      try {
        db.updateStatus('Updating…');
        db.update(data.body.table, data.body.parameters);

        if (data.header.response) {
          process.send({
            header: { type: data.header.response },
            body: 'Updated successfully.',
          });
        }

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) console.error(error);
        db.updateStatus('Error');
      }

      break;

    case 'ledger':
      try {
        db.updateStatus('Creating ledger…');

        const providerWhere = data.body.provider
          ? {
              column: 'provider',
              operator: 'LIKE',
              value: `%${data.body.provider}%`,
            }
          : null;

        const productWhere = data.body.product
          ? {
              column: 'product',
              operator: 'LIKE',
              value: `%${data.body.product}%`,
            }
          : null;

        const medicationOrderIdWhere = data.body.medicationOrderId
          ? {
              column: 'medicationOrderId',
              operator: 'LIKE',
              value: `%${data.body.medicationOrderId}%`,
            }
          : null;

        const withdrawals = db.read('adcTransaction', {
          columns: [
            'adcTransaction.id',
            'timestamp',
            'provider.id AS providerId',
            "provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider",
            "medication.name || ', ' || medicationProduct.strength || ' ' || medicationProduct.units || ' ' || medicationProduct.form AS product",
            'medication.name AS medication',
            'medicationProduct.strength',
            'medicationProduct.units',
            'medicationProductId',
            'mrn',
            'amount',
            'medicationOrderId',
          ],

          wheres: [
            {
              column: 'timestamp',
              operator: '>',
              value: data.body.datetimeStart,
            },
            {
              column: 'timestamp',
              operator: '<',
              value: data.body.datetimeEnd,
            },
            {
              column: 'adcTransactionType.name',
              operator: '=',
              value: 'Withdrawal',
            },
            providerWhere,
            productWhere,
            medicationOrderIdWhere,
          ],

          joins: [
            {
              type: 'LEFT',
              table: 'providerAdc',
              predicate: 'providerAdcId = providerAdc.id',
            },
            {
              type: 'LEFT',
              table: 'provider',
              predicate: 'providerAdc.providerId = provider.id',
            },
            {
              type: '',
              table: 'medicationProduct',
              predicate: 'medicationProductId = medicationProduct.id',
            },
            {
              type: '',
              table: 'medication',
              predicate: 'medicationProduct.medicationId = medication.id',
            },

            {
              type: 'LEFT',
              table: 'adcTransactionType',
              predicate: 'typeId = adcTransactionType.id',
            },
          ],

          orderBys: [
            {
              column: 'timestamp',
              direction: 'ASC',
            },
          ],
        });

        const wastes = db.read('adcTransaction', {
          columns: [
            'adcTransaction.id',
            'timestamp',
            'provider.id AS providerId',
            "provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider",
            'medicationProductId',
            'amount',
            'medicationProduct.units AS units',
            'medicationOrderId',
            'mrn',
          ],

          wheres: [
            {
              column: 'timestamp',
              operator: '<',
              value: data.body.datetimeEnd,
            },
            {
              column: 'timestamp',
              operator: '>',
              value: data.body.datetimeStart,
            },
            {
              column: 'adcTransactionType.name',
              operator: '=',
              value: 'Waste',
            },
          ],

          joins: [
            {
              type: 'LEFT',
              table: 'providerAdc',
              predicate: 'providerAdcId = providerAdc.id',
            },
            {
              type: 'LEFT',
              table: 'provider',
              predicate: 'providerAdc.providerId = provider.id',
            },
            {
              type: '',
              table: 'medicationProduct',
              predicate: 'medicationProductId = medicationProduct.id',
            },
            {
              type: 'LEFT',
              table: 'adcTransactionType',
              predicate: 'typeId = adcTransactionType.id',
            },
          ],

          orderBys: [
            {
              column: 'timestamp',
              direction: 'ASC',
            },
          ],
        });

        const otherTransactions = db.read('adcTransaction', {
          columns: [
            'adcTransaction.id',
            'adcTransactionType.name AS type',
            'timestamp',
            'provider.id AS providerId',
            "provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider",
            'medicationProductId',
            'amount',
            'medicationOrderId',
            'mrn',
          ],

          wheres: [
            {
              column: 'timestamp',
              operator: '<',
              value: data.body.datetimeEnd,
            },
            {
              column: 'timestamp',
              operator: '>',
              value: data.body.datetimeStart,
            },
            [
              {
                column: 'adcTransactionType.name',
                operator: '=',
                value: 'Restock',
              },
              {
                column: 'adcTransactionType.name',
                operator: '=',
                value: 'Return',
              },
            ],
          ],

          joins: [
            {
              type: 'LEFT',
              table: 'providerAdc',
              predicate: 'providerAdcId = providerAdc.id',
            },
            {
              type: 'LEFT',
              table: 'provider',
              predicate: 'providerAdc.providerId = provider.id',
            },
            {
              type: 'LEFT',
              table: 'adcTransactionType',
              predicate: 'typeId = adcTransactionType.id',
            },
          ],

          orderBys: [
            {
              column: 'timestamp',
              direction: 'ASC',
            },
          ],
        });

        const administrations = db.read('emarAdministration', {
          columns: [
            'emarAdministration.id',
            'timestamp',
            'provider.id AS providerId',
            "provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider",
            'medicationOrderId',
            'mrn',
            'medicationOrder.dose',
            'medication.name AS medication',
          ],

          wheres: [
            {
              column: 'timestamp',
              operator: '<',
              value: data.body.datetimeEnd,
            },
            {
              column: 'timestamp',
              operator: '>',
              value: data.body.datetimeStart,
            },
          ],

          joins: [
            {
              type: 'LEFT',
              table: 'providerEmar',
              predicate: 'providerEmarId = providerEmar.id',
            },
            {
              type: 'LEFT',
              table: 'provider',
              predicate: 'providerEmar.providerId = provider.id',
            },
            {
              type: 'LEFT',
              table: 'medicationOrder',
              predicate: 'medicationOrderId = medicationOrder.id',
            },
            {
              type: 'LEFT',
              table: 'medication',
              predicate: 'medicationOrder.medicationId = medication.id',
            },
            {
              type: 'LEFT',
              table: 'visit',
              predicate: 'medicationOrder.visitId = visit.id',
            },
          ],

          orderBys: [
            {
              column: 'timestamp',
              direction: 'ASC',
            },
          ],
        });

        const painAssessments = db.read('emarPainAssessment', {
          columns: [
            'emarPainAssessment.id',
            'timestamp',
            'provider.id AS providerId',
            "provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider",
            'medicationOrderId',
            'byPolicy',
            'mrn',
            'medicationOrder.dose',
            'medication.name AS medication',
          ],

          wheres: [
            {
              column: 'timestamp',
              operator: '<',
              value: data.body.datetimeEnd,
            },
            {
              column: 'timestamp',
              operator: '>',
              value: data.body.datetimeStart,
            },
          ],

          joins: [
            {
              type: 'LEFT',
              table: 'providerEmar',
              predicate: 'providerEmarId = providerEmar.id',
            },
            {
              type: 'LEFT',
              table: 'provider',
              predicate: 'providerEmar.providerId = provider.id',
            },
            {
              type: 'LEFT',
              table: 'medicationOrder',
              predicate: 'medicationOrderId = medicationOrder.id',
            },
            {
              type: 'LEFT',
              table: 'medication',
              predicate: 'medicationOrder.medicationId = medication.id',
            },
            {
              type: 'LEFT',
              table: 'visit',
              predicate: 'medicationOrder.visitId = visit.id',
            },
          ],

          orderBys: [
            {
              column: 'timestamp',
              direction: 'ASC',
            },
          ],
        });

        const result = [...withdrawals].reverse(); // Withdrawals are run in reverse so that later administrations are not assigned as dispositions for earlier diversions.

        // Adjustments are present for administration to adc transaction time comparisons. Emar and Adc time are not coordinated, and Emar time is only precise to the minute. Adc is precise to the second.

        result.forEach(withdrawal => {
          if (withdrawal.medicationOrderId === 'OVERRIDE') {
            // I cannot think of a way to reliably identify multiple wastes for an overridden withdrawal, programmatically.
            // For the time being, I am accepting up to one waste for an overridden withdrawal.

            const wasteIndex = wastes.findIndex(
              waste =>
                waste.mrn === withdrawal.mrn &&
                waste.medicationProductId === withdrawal.medicationProductId &&
                waste.timestamp >= withdrawal.timestamp &&
                !waste.reconciled
            );

            if (wastes[wasteIndex]) {
              wastes[wasteIndex].reconciled = true;

              const waste = wastes[wasteIndex];

              withdrawal.waste = `${waste.amount} ${waste.units}`;
              withdrawal.wasteAmount = waste.amount;
            }

            const administrationIndex = administrations.findIndex(
              administration => {
                if (withdrawal.waste) {
                  return (
                    administration.medication === withdrawal.medication &&
                    administration.mrn === withdrawal.mrn &&
                    withdrawal.amount * withdrawal.strength -
                      withdrawal.wasteAmount ===
                      administration.dose &&
                    new Date(administration.timestamp).getTime() >=
                      new Date(withdrawal.timestamp).getTime() - 300000 &&
                    !administration.reconciled
                  );
                }

                return (
                  administration.medication === withdrawal.medication &&
                  administration.mrn === withdrawal.mrn &&
                  withdrawal.amount * withdrawal.strength ===
                    administration.dose &&
                  new Date(administration.timestamp).getTime() >=
                    new Date(withdrawal.timestamp).getTime() - 300000 &&
                  !administration.reconciled
                );
              }
            );

            if (administrations[administrationIndex]) {
              administrations[administrationIndex].reconciled = true;

              const administration = administrations[administrationIndex];

              withdrawal.dispositionProvider = administration.provider;
              withdrawal.dispositionTimestamp = administration.timestamp;
              withdrawal.dispositionType = 'Administration';

              const painAssessmentIndex = painAssessments.findIndex(
                painAssessment =>
                  painAssessment.medicationOrderId ===
                    administration.medicationOrderId &&
                  new Date(painAssessment.timestamp).getTime() >=
                    new Date(administration.timestamp).getTime() &&
                  new Date(painAssessment.timestamp).getTime() <
                    new Date(administration.timestamp).getTime() + 3600000 && // Up to one hour after administration
                  painAssessment.byPolicy &&
                  !painAssessment.reconciled
              );

              if (painAssessments[painAssessmentIndex]) {
                painAssessments[painAssessmentIndex].reconciled = true;

                const painAssessment = painAssessments[painAssessmentIndex];

                withdrawal.painAssessmentProvider = painAssessment.provider;
                withdrawal.painAssessmentTimestamp = painAssessment.timestamp;
              }
            } else {
              const otherTransactionIndex = otherTransactions.findIndex(
                otherTransaction =>
                  otherTransaction.mrn === withdrawal.mrn &&
                  otherTransaction.medicationProductId ===
                    withdrawal.medicationProductId &&
                  otherTransaction.timestamp >= withdrawal.timestamp &&
                  !otherTransaction.reconciled
              );

              if (otherTransactions[otherTransactionIndex]) {
                otherTransactions[otherTransactionIndex].reconciled = true;

                const otherTransaction =
                  otherTransactions[otherTransactionIndex];

                withdrawal.dispositionProvider = otherTransaction.provider;
                withdrawal.dispositionTimestamp = otherTransaction.timestamp;
                withdrawal.dispositionType = otherTransaction.type;
              }
            }
          } else {
            const nextWithdrawal = withdrawals.find(
              otherWithdrawal =>
                otherWithdrawal.medicationOrderId ===
                  withdrawal.medicationOrderId &&
                otherWithdrawal.timestamp > withdrawal.timestamp
            );

            // There can be multiple wastes for a single withdrawal. What follows finds all those wastes, and if the entire withdrawal is wasted, marks the last waste as disposition.
            const totalStrength = withdrawal.amount * withdrawal.strength;

            let totalWaste = 0;
            let lastWasteIndex = 0;

            for (
              let i = 0;
              i < wastes.length && totalWaste < totalStrength;
              i++
            ) {
              const waste = wastes[i];

              if (nextWithdrawal) {
                if (
                  waste.medicationOrderId === withdrawal.medicationOrderId &&
                  waste.timestamp >= withdrawal.timestamp &&
                  waste.timestamp < nextWithdrawal.timestamp &&
                  !waste.reconciled
                ) {
                  wastes[i].reconciled = true;

                  totalWaste += waste.amount;
                  lastWasteIndex = i;
                }
              } else if (
                waste.medicationOrderId === withdrawal.medicationOrderId &&
                waste.timestamp >= withdrawal.timestamp &&
                !waste.reconciled
              ) {
                wastes[i].reconciled = true;

                totalWaste += waste.amount;
                lastWasteIndex = i;
              }
            }

            withdrawal.wasteAmount = totalWaste;

            const lastWaste = wastes[lastWasteIndex];

            withdrawal.waste =
              totalWaste > 0 ? `${totalWaste} ${lastWaste.units}` : null;

            if (totalWaste >= totalStrength) {
              withdrawal.dispositionType = 'Waste';
              withdrawal.dispositionProvider = lastWaste.provider;
              withdrawal.dispositionTimestamp = lastWaste.timestamp;
            } else {
              const administrationIndex = administrations.findIndex(
                administration => {
                  if (nextWithdrawal) {
                    return (
                      administration.medicationOrderId ===
                        withdrawal.medicationOrderId &&
                      new Date(administration.timestamp).getTime() >=
                        new Date(withdrawal.timestamp).getTime() - 300000 &&
                      administration.timestamp < nextWithdrawal.timestamp &&
                      !administration.reconciled
                    );
                  }

                  return (
                    administration.medicationOrderId ===
                      withdrawal.medicationOrderId &&
                    new Date(administration.timestamp).getTime() >=
                      new Date(withdrawal.timestamp).getTime() - 300000 &&
                    !administration.reconciled
                  );
                }
              );

              if (administrations[administrationIndex]) {
                administrations[administrationIndex].reconciled = true;

                const administration = administrations[administrationIndex];

                withdrawal.dispositionProvider = administration.provider;
                withdrawal.dispositionTimestamp = administration.timestamp;
                withdrawal.dispositionType = 'Administration';

                const painAssessmentIndex = painAssessments.findIndex(
                  painAssessment => {
                    if (nextWithdrawal) {
                      return (
                        painAssessment.medicationOrderId ===
                          administration.medicationOrderId &&
                        new Date(painAssessment.timestamp).getTime() >=
                          new Date(administration.timestamp).getTime() &&
                        new Date(painAssessment.timestamp).getTime() <
                          new Date(administration.timestamp).getTime() +
                            3600000 && // Up to one hour after administration.
                        painAssessment.timestamp < nextWithdrawal.timestamp &&
                        painAssessment.byPolicy &&
                        !painAssessment.reconciled
                      );
                    }

                    return (
                      painAssessment.medicationOrderId ===
                        administration.medicationOrderId &&
                      new Date(painAssessment.timestamp).getTime() >=
                        new Date(administration.timestamp).getTime() &&
                      new Date(painAssessment.timestamp).getTime() <
                        new Date(administration.timestamp).getTime() +
                          3600000 && // Up to one hour after administration
                      painAssessment.byPolicy &&
                      !painAssessment.reconciled
                    );
                  }
                );

                if (painAssessments[painAssessmentIndex]) {
                  painAssessments[painAssessmentIndex].reconciled = true;

                  const painAssessment = painAssessments[painAssessmentIndex];

                  withdrawal.painAssessmentProvider = painAssessment.provider;
                  withdrawal.painAssessmentTimestamp = painAssessment.timestamp;
                }
              } else {
                const otherTransactionIndex = otherTransactions.findIndex(
                  otherTransaction => {
                    if (nextWithdrawal) {
                      return (
                        otherTransaction.medicationOrderId ===
                          withdrawal.medicationOrderId &&
                        otherTransaction.timestamp >= withdrawal.timestamp &&
                        otherTransaction.timestamp < nextWithdrawal.timestamp &&
                        !otherTransaction.reconciled
                      );
                    }

                    return (
                      otherTransaction.medicationOrderId ===
                        withdrawal.medicationOrderId &&
                      otherTransaction.timestamp >= withdrawal.timestamp &&
                      !otherTransaction.reconciled
                    );
                  }
                );

                if (otherTransactions[otherTransactionIndex]) {
                  otherTransactions[otherTransactionIndex].reconciled = true;

                  const otherTransaction =
                    otherTransactions[otherTransactionIndex];

                  withdrawal.dispositionProvider = otherTransaction.provider;
                  withdrawal.dispositionTimestamp = otherTransaction.timestamp;
                  withdrawal.dispositionType = otherTransaction.type;
                }
              }
            }
          }
        });

        process.send({
          header: { type: data.header.response },
          body: result.reverse(),
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) console.error(error);
        db.updateStatus('Error');
      }
      break;

    case 'transaction':
      try {
        db.updateStatus('Reading…');

        const datetimeStart = data.body.datetimeStart
          ? {
              column: 'timestamp',
              operator: '>',
              value: data.body.datetimeStart,
            }
          : null;

        const datetimeEnd = data.body.datetimeEnd
          ? { column: 'timestamp', operator: '<', value: data.body.datetimeEnd }
          : null;

        const transactionTypes = data.body.transactionTypes
          ? data.body.transactionTypes.map(transactionType => ({
              column: 'adcTransactionType.name',
              operator: '=',
              value: transactionType,
            }))
          : null;

        const provider = data.body.provider
          ? {
              column: 'provider',
              operator: 'LIKE',
              value: `%${data.body.provider}%`,
            }
          : null;

        const product = data.body.product
          ? {
              column: 'product',
              operator: 'LIKE',
              value: `%${data.body.product}%`,
            }
          : null;

        const medicationOrderId = data.body.medicationOrderId
          ? {
              column: 'medicationOrderId',
              operator: 'LIKE',
              value: `%${data.body.medicationOrderId}%`,
            }
          : null;

        const result = db.read('adcTransaction', {
          columns: [
            'adcTransaction.id',
            'timestamp',
            "provider.lastName || ', ' || provider.firstName || ' ' || provider.middleInitial AS provider",
            'adcTransactionType.name AS transactionType',
            "medication.name || ', ' || medicationProduct.strength || ' ' || medicationProduct.units || ' ' || medicationProduct.form AS product",
            'amount',
            'medicationOrderId',
          ],

          wheres: [
            datetimeStart,
            datetimeEnd,
            transactionTypes,
            provider,
            product,
            medicationOrderId,
          ],

          joins: [
            {
              type: '',
              table: 'providerAdc',
              predicate: 'providerAdcId = providerAdc.id',
            },
            {
              type: '',
              table: 'provider',
              predicate: 'providerAdc.providerId = provider.id',
            },
            {
              type: '',
              table: 'medicationProduct',
              predicate: 'medicationProductId = medicationProduct.id',
            },
            {
              type: '',
              table: 'medication',
              predicate: 'medicationProduct.medicationId = medication.id',
            },
            {
              type: '',
              table: 'adcTransactionType',
              predicate: 'typeId = adcTransactionType.id',
            },
          ],

          orderBys: [
            {
              column: 'timestamp',
              direction: 'ASC',
            },
          ],
        });

        console.log(result);

        process.send({
          header: { type: data.header.response },
          body: result,
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) console.error(error);
        db.updateStatus('Error');
      }

      break;

    case 'administration':
      try {
        db.updateStatus('Reading…');

        const datetimeStart = data.body.datetimeStart
          ? {
              column: 'timestamp',
              operator: '>',
              value: data.body.datetimeStart,
            }
          : null;

        const datetimeEnd = data.body.datetimeEnd
          ? { column: 'timestamp', operator: '<', value: data.body.datetimeEnd }
          : null;

        const provider = data.body.provider
          ? {
              column: 'provider',
              operator: 'LIKE',
              value: `%${data.body.provider}%`,
            }
          : null;

        const medication = data.body.medication
          ? {
              column: 'medication',
              operator: 'LIKE',
              value: `%${data.body.medication}%`,
            }
          : null;

        const medicationOrderId = data.body.medicationOrderId
          ? {
              column: 'medicationOrderId',
              operator: 'LIKE',
              value: `%${data.body.medicationOrderId}%`,
            }
          : null;

        const result = db.read('emarAdministration', {
          columns: [
            'emarAdministration.id',
            'timestamp',
            "provider.lastName || ', ' || provider.firstName || ' ' || provider.middleInitial AS provider",
            "medication.name || ', ' || medicationOrder.form AS medication",
            "medicationOrder.dose || ' ' || medicationOrder.units AS dose",
            'medicationOrderId',
          ],

          wheres: [
            datetimeStart,
            datetimeEnd,
            provider,
            medication,
            medicationOrderId,
          ],

          joins: [
            {
              type: '',
              table: 'providerEmar',
              predicate: 'providerEmarId = providerEmar.id',
            },
            {
              type: '',
              table: 'provider',
              predicate: 'providerEmar.providerId = provider.id',
            },
            {
              type: '',
              table: 'medicationOrder',
              predicate: 'medicationOrderId = medicationOrder.id',
            },
            {
              type: '',
              table: 'medication',
              predicate: 'medicationOrder.medicationId = medication.id',
            },
          ],

          orderBys: [
            {
              column: 'timestamp',
              direction: 'ASC',
            },
          ],
        });

        process.send({
          header: { type: data.header.response },
          body: result,
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) console.error(error);
        db.updateStatus('Error');
      }

      break;
    case 'provider':
      try {
        db.updateStatus('Reading…');

        const lastName = data.body.lastName
          ? {
              column: 'lastName',
              operator: 'LIKE',
              value: `%${data.body.lastName}%`,
            }
          : null;

        const firstName = data.body.firstName
          ? {
              column: 'firstName',
              operator: 'LIKE',
              value: `%${data.body.firstName}%`,
            }
          : null;

        const middleInitial = data.body.middleInitial
          ? {
              column: 'middleInitial',
              operator: 'LIKE',
              value: `%${data.body.middleInitial}%`,
            }
          : null;

        const adcId = data.body.adcId
          ? {
              column: 'providerAdc.name',
              operator: 'LIKE',
              value: `%${data.body.adcId}%`,
            }
          : null;

        const emarId = data.body.emarId
          ? {
              column: 'providerEmar.name',
              operator: 'LIKE',
              value: `%${data.body.emarId}%`,
            }
          : null;

        const result = db.read('provider', {
          isDistinct: true,

          columns: [
            'provider.id',
            'lastName',
            'firstName',
            'middleInitial',
            "(SELECT group_concat(name, '; ') FROM providerAdc WHERE providerId = provider.id) AS adcId",
            "(SELECT group_concat(name, '; ') FROM providerEmar WHERE providerId = provider.id) AS emarId",
          ],

          wheres: [lastName, firstName, middleInitial, adcId, emarId],
          joins: [
            {
              type: 'LEFT',
              table: 'providerAdc',
              predicate: 'provider.id = providerAdc.providerId',
            },
            {
              type: 'LEFT',
              table: 'providerEmar',
              predicate: 'provider.id = providerEmar.providerId',
            },
          ],

          orderBys: [
            {
              column: 'lastName',
              direction: 'ASC',
            },
            {
              column: 'firstName',
              direction: 'ASC',
            },
            {
              column: 'middleInitial',
              direction: 'ASC',
            },
          ],
        });

        process.send({
          header: { type: data.header.response },
          body: result,
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) console.error(error);
        db.updateStatus('Error');
      }

      break;

    default:
      db.updateStatus('Error');
  }
});
