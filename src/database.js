const path = require('path');
const fs = require('fs');

const Database = require('better-sqlite3');
const Excel = require('exceljs');

const schema = require('./schema.js');

const dbPath = path.join(__dirname, 'data', 'database.db');
const db = new Database(dbPath, { verbose: console.log });

db.create = (table, parameters) => {
  const onConflict = parameters.onConflict
    ? `OR ${parameters.onConflict.toUpperCase()} `
    : '';
  const columns = Object.keys(parameters.data).join(', ');
  const values = Object.values(parameters.data);
  const valuePlaceholders = values.map(() => '?').join(', ');

  const stmt = db.prepare(`
    INSERT ${onConflict}INTO ${table} (${columns})
    VALUES (${valuePlaceholders});
    `);

  stmt.run(...values);
};

db.read = (table, parameters) => {
  const isDistinct = parameters.isDistinct ? 'DISTINCT ' : '';
  const columns = parameters.columns.join(', ');

  const whereValues = parameters.wheres
    ? parameters.wheres
        .filter(where => where)
        .reduce((flattenedWheres, where) => {
          return flattenedWheres.concat(where);
        }, [])
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

  // This console.log for debugging queries, remove for production
  console.log(`
  SELECT ${isDistinct}${columns}
  FROM ${table}
  ${joins}
  ${wheres}
  ${orderBys}
  ${limit};
`);

  const stmt = db.prepare(`
    SELECT ${isDistinct}${columns}
    FROM ${table}
    ${joins}
    ${wheres}
    ${orderBys}
    ${limit};
  `);

  if (parameters.columns.length === 1 && /id/i.test(parameters.columns[0])) {
    const record = stmt.get(...whereValues);
    return record ? record.id : null;
  }

  const records = stmt.all(...whereValues);
  return records || null;
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
        .reduce((flattenedWheres, where) => {
          return flattenedWheres.concat(where);
        }, [])
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

  const stmt = db.prepare(`
  UPDATE ${onConflict}${table}
  ${sets}
  ${wheres};
  `);

  stmt.run(...setValues, ...whereValues);
};

db.delete = (table, parameters) => {
  const whereValues = parameters.wheres
    ? parameters.wheres
        .filter(where => where)
        .reduce((flattenedWheres, where) => {
          return flattenedWheres.concat(where);
        }, [])
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

  const stmt = db.prepare(`
  DELETE FROM ${table}
  ${wheres};
  `);

  stmt.run(...whereValues);
};

db.updateStatus = status => {
  db.status = status;
  process.send({
    header: { type: 'status' },
    body: db.status,
  });
};

db.initialize = () => {
  db.updateStatus('Initializing');

  Object.entries(schema).forEach(([table, parameters]) => {
    const columns = Object.entries(parameters.columns)
      .map(([column, constraint]) => `${column} ${constraint}`)
      .join(', ');

    const unique = parameters.unique
      ? `, UNIQUE (${parameters.unique.columns.join(
          ', '
        )}) ON CONFLICT ${parameters.unique.onConflict.toUpperCase()}`
      : '';

    const stmt = db.prepare(`
      CREATE TABLE IF NOT EXISTS ${table}
      (${columns}${unique});
      `);

    stmt.run();
  });

  const medications = [
    'Fentanyl',
    'Hydrocodone–Homatropine',
    'Hydromorphone',
    'Morphine',
    'Oxycodone',
    'Oxycodone–Acetaminophen',
  ];

  medications.forEach(medication => {
    db.create('medication', {
      onConflict: 'ignore',
      data: { name: medication },
    });
  });

  const adcTransactionTypes = ['Restock', 'Return', 'Waste', 'Withdrawal'];

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

db.parseAdc = function parseAdc(filePath) {
  return new Promise((resolve, reject) => {
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
        worksheet.eachRow((row, rowNumber) => {
          const headerRowNumber = 11;
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

          if (
            rowNumber > headerRowNumber &&
            medicationId &&
            adcTransactionType
          ) {
            const strength = row.getCell('O').value;
            const units = getUnits(row.getCell('C').value);
            const form = getForm(row.getCell('C').value);
            const medicationOrderId =
              row.getCell('J').value === 'OVERRIDE'
                ? 'OVERRIDE'
                : row.getCell('J').value.slice(1);
            const amount = row.getCell('D').value;
            const timestamp = getTimestamp(
              row.getCell('A').value,
              row.getCell('B').value
            );

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
              data: { name: row.getCell('C').value },
            });

            const medicationProductAdcId = db.read('medicationProductAdc', {
              columns: ['id'],
              wheres: [
                {
                  column: 'name',
                  operator: '=',
                  value: row.getCell('C').value,
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
        });
      })
      .then(() => {
        readStream.close();
        resolve();
      })
      .catch(error => reject(error));
  });
};

db.parseEmar = function parseEmar(filePath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);

    const workbook = new Excel.Workbook();
    workbook.csv
      .read(readStream)
      .then(worksheet => {
        const getTimestamp = string => {
          if (!string) {
            return null;
          }

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

        worksheet.eachRow((row, rowNumber) => {
          const headerRowNumber = 7;

          if (rowNumber > headerRowNumber) {
            const visitId = row.getCell('F').value;
            const discharged = getTimestamp(row.getCell('L').value);
            const mrn = row.getCell('G').value;
            const medicationOrderId = row.getCell('M').value;
            let [dose, units] = row.getCell('R').value.split(/\s/);
            const form = getForm(row.getCell('P').value);
            units = getUnits(units);
            const timestamp = getTimestamp(row.getCell('AM').value);

            db.create('visit', {
              onConflict: 'replace',
              data: {
                id: visitId,
                discharged,
                mrn,
              },
            });

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

            db.create('administration', {
              onConflict: 'ignore',
              data: { providerEmarId, medicationOrderId, timestamp },
            });
          }
        });
      })
      .then(() => {
        readStream.close();
        resolve();
      })
      .catch(error => reject(error));
  });
};

process.on('message', data => {
  if (data.header.type === 'status') {
    if (data.header.response) {
      process.send({
        header: { type: data.header.response },
        body: db.status,
      });
    }
  }

  if (data.header.type === 'import') {
    db.updateStatus('Importing…');

    try {
      db.parseAdc(data.body.adcPath);
      db.parseEmar(data.body.emarPath);

      if (data.header.response) {
        process.send({
          header: { type: data.header.response },
          body: 'Imported successfully.',
        });
      }
    } catch (error) {
      db.updateStatus('Error');
      console.error(error);
    }

    Promise.all([])
      .then(() => {
        db.updateStatus('Ready');
      })
      .catch(error => {});
  }

  if (data.header.type === 'query') {
    db.updateStatus('Querying…');

    try {
      const records = db.read(data.body.table, data.body.parameters);

      if (data.header.response) {
        process.send({
          header: { type: data.header.response },
          body: records,
        });
      }

      db.updateStatus('Ready');
    } catch (error) {
      db.updateStatus('Error');
      console.error(error);
    }
  }

  if (data.header.type === 'update') {
    db.updateStatus('Updating…');

    try {
      db.update(data.body.table, data.body.parameters);

      if (data.header.response) {
        process.send({
          header: { type: data.header.response },
          body: 'Updated successfully.',
        });
      }

      db.updateStatus('Ready');
    } catch (error) {
      db.updateStatus('Error');
      console.error(error);
    }
  }

  if (data.header.type === 'ledger') {
    try {
      db.updateStatus('Creating ledger…');

      const providerWhere = data.body.provider
        ? {
            column: 'providerName',
            operator: 'LIKE',
            value: `%${data.body.provider}%`,
          }
        : null;

      const medicationOrderIdWhere = data.body.medicationOrderId
        ? data.body.medicationOrderId
        : null;

      const productWhere = data.body.product ? data.body.product : null;

      const withdrawals = db.read('adcTransaction', {
        columns: [
          'adcTransaction.id',
          'timestamp',
          'provider.id AS providerId',
          "provider.lastName || ', ' || provider.firstName || ' ' || provider.middleInitial AS provider",
          "medication.name || ', ' || medicationProduct.strength || ' ' || medicationProduct.units || ' ' || medicationProduct.form AS product",
          'medicationProductId',
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
          medicationOrderIdWhere,
          productWhere,
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
          'medicationProductId',
          "amount || ' ' || medicationProduct.units AS amount",
          'medicationOrderId',
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
          "provider.lastName || ', ' || provider.firstName || ' ' || provider.middleInitial AS provider",
          'medicationProductId',
          'amount',
          'medicationOrderId',
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
          "provider.lastName || ', ' || provider.firstName || ' ' || provider.middleInitial AS provider",
          'medicationOrderId',
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
        ],

        orderBys: [
          {
            column: 'timestamp',
            direction: 'ASC',
          },
        ],
      });

      withdrawals.forEach(withdrawal => {
        if (withdrawal.medicationOrderId === 'OVERRIDE') {
          // Run OVERRIDE logic
        } else {
          const nextWithdrawal = withdrawals.find(
            otherWithdrawal =>
              otherWithdrawal.medicationOrderId ===
                withdrawal.medicationOrderId &&
              otherWithdrawal.timestamp > withdrawal.timestamp
          );

          withdrawal.waste = wastes.find(waste => {
            if (nextWithdrawal) {
              return (
                waste.medicationOrderId === withdrawal.medicationOrderId &&
                waste.timestamp >= withdrawal.timestamp &&
                waste.timestamp < nextWithdrawal.timestamp &&
                !waste.reconciled
              );
            }

            return (
              waste.medicationOrderId === withdrawal.medicationOrderId &&
              waste.timestamp >= withdrawal.timestamp &&
              !waste.reconciled
            );
          });

          withdrawal.disposition = administrations.find(administration => {
            if (nextWithdrawal) {
              return (
                administration.medicationOrderId ===
                  withdrawal.medicationOrderId &&
                administration.timestamp >= withdrawal.timestamp &&
                administration.timestamp < nextWithdrawal.timestamp &&
                !administration.reconciled
              );
            }

            return (
              administration.medicationOrderId ===
                withdrawal.medicationOrderId &&
              administration.timestamp >= withdrawal.timestamp &&
              !administration.reconciled
            );
          });

          if (withdrawal.disposition) {
            withdrawal.disposition.type = 'Administration';
          } else {
            withdrawal.disposition = otherTransactions.find(
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
          }
        }
      });

      process.send({
        header: { type: data.header.response },
        body: withdrawals,
      });

      db.updateStatus('Ready');
    } catch (error) {
      console.error(error);
      db.updateStatus('Error');
    }
  }

  if (data.header.type === 'transaction') {
    try {
      db.updateStatus('Reading…');

      const datetimeStart = data.body.datetimeStart
        ? { column: 'timestamp', operator: '>', value: data.body.datetimeStart }
        : null;

      const datetimeEnd = data.body.datetimeEnd
        ? { column: 'timestamp', operator: '<', value: data.body.datetimeEnd }
        : null;

      const transactionTypes = data.body.transactionTypes
        ? data.body.transactionTypes.map(transactionType => {
            return {
              column: 'adcTransactionType.name',
              operator: '=',
              value: transactionType,
            };
          })
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

      process.send({
        header: { type: data.header.response },
        body: result,
      });

      db.updateStatus('Ready');
    } catch (error) {
      console.error(error);
      db.updateStatus('Error');
    }
  }

  if (data.header.type === 'administration') {
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
      console.error(error);
      db.updateStatus('Error');
    }
  }

  if (data.header.type === 'provider') {
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
      console.error(error);
      db.updateStatus('Error');
    }
  }
});
