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

  const wheres = parameters.wheres
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
        .map(join => `JOIN ${join.table} ON ${join.predicate}`)
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

  const set = Object.keys(parameters.set)
    .map(column => `${column} = ?`)
    .join(', ');

  const values = Object.values(parameters.set);

  const whereValues = parameters.wheres
    ? parameters.wheres.filter(where => where).map(({ value }) => value)
    : null;

  const wheres = parameters.wheres
    ? `WHERE ${parameters.wheres
        .filter(where => where)
        .map(({ column, operator }) => {
          if (/timestamp/.test(column)) {
            return `strftime('%s', ${column}) ${operator} strftime('%s', ?)`;
          }
          return `${column} ${operator} ?`;
        })
        .join(' AND ')}`
    : '';

  const stmt = db.prepare(`
  UPDATE ${onConflict}${table}
  SET ${set}
  ${wheres};
  `);

  stmt.run(...values, ...whereValues);
};

db.delete = (table, parameters) => {
  const whereValues = parameters.wheres
    ? parameters.wheres.filter(where => where).map(({ value }) => value)
    : null;

  const wheres = parameters.wheres
    ? `WHERE ${parameters.wheres
        .filter(where => where)
        .map(({ column, operator }) => {
          if (/timestamp/.test(column)) {
            return `strftime('%s', ${column}) ${operator} strftime('%s', ?)`;
          }
          return `${column} ${operator} ?`;
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
    header: 'status',
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
  if (data.header === 'status') {
    process.send({
      header: 'status',
      body: db.status,
    });
  }

  if (data.header === 'upload') {
    db.updateStatus('Uploading');

    Promise.all([
      db.parseAdc(data.body.adcPath),
      db.parseEmar(data.body.emarPath),
    ])
      .then(() => db.updateStatus('Ready'))
      .catch(error => {
        db.updateStatus('Error');
        console.error(error);
      });
  }

  if (data.header === 'query') {
    db.updateStatus('Querying');
    try {
      const records = db.read(data.body.table, data.body.parameters);
      process.send({ header: 'query', body: records });
      db.updateStatus('Ready');
    } catch (error) {
      db.updateStatus('Error');
      console.error(error);
    }
  }
});
