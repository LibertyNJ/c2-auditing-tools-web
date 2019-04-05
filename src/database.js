const path = require('path');

const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'data', 'database.db');
const db = new Database(dbPath, { verbose: console.log });

const schema = {
  administration: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      providerEmarId: 'INTEGER REFERENCES providerEmar(id) NOT NULL',
      medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
      timestamp: 'CHAR(19) NOT NULL',
    },
    unique: {
      columns: ['medicationOrderId', 'timestamp'],
      onConflict: 'ignore',
    },
  },

  medication: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      name: 'VARCHAR(255) UNIQUE NOT NULL',
    },
  },

  medicationOrder: {
    columns: {
      id: 'CHAR(9) PRIMARY KEY',
      medicationId: 'VARCHAR(255) REFERENCES medication(id) NOT NULL',
      dose: 'FLOAT NOT NULL',
      units: 'VARCHAR(255) NOT NULL',
      form: 'VARCHAR(255) NOT NULL',
      visitId: 'CHAR(12) REFERENCES visit(id) NOT NULL',
    },
  },

  medicationProduct: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      medicationId: 'VARCHAR(255) REFERENCES medication(id) NOT NULL',
      strength: 'FLOAT NOT NULL',
      units: 'VARCHAR(255) NOT NULL',
      form: 'VARCHAR(255) NOT NULL',
      adcId: 'INTEGER REFERENCES medicationProductAdc(id) UNIQUE NOT NULL',
    },
  },

  medicationProductAdc: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      name: 'VARCHAR(255) UNIQUE NOT NULL',
    },
    unique: {
      columns: ['name'],
      onConflict: 'ignore',
    },
  },

  provider: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      lastName: 'VARCHAR(255) NOT NULL',
      firstName: 'VARCHAR(255) NOT NULL',
      mi: 'CHAR(1)',
      adcId: 'INTEGER REFERENCES providerAdc(id) UNIQUE',
      emarId: 'INTEGER REFERENCES providerEmar(id) UNIQUE',
    },
  },

  providerAdc: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      name: 'VARCHAR(255) NOT NULL',
    },
    unique: {
      columns: ['name'],
      onConflict: 'ignore',
    },
  },

  providerEmar: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      name: 'VARCHAR(255) NOT NULL',
    },
    unique: {
      columns: ['name'],
      onConflict: 'ignore',
    },
  },

  restock: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      providerAdcId: 'INTEGER REFERENCES ProviderAdc(id) NOT NULL',
      medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
      medicationProductId: 'INTEGER REFERENCES medicationProduct(id) NOT NULL',
      amount: 'INT NOT NULL',
      timestamp: 'CHAR(19) NOT NULL',
    },
    unique: {
      columns: ['medicationOrderId', 'timestamp'],
      onConflict: 'ignore',
    },
  },

  return: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      providerAdcId: 'INTEGER REFERENCES ProviderAdc(id) NOT NULL',
      medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
      medicationProductId: 'INTEGER REFERENCES medicationProduct(id) NOT NULL',
      amount: 'INT NOT NULL',
      timestamp: 'CHAR(19) NOT NULL',
    },
    unique: {
      columns: ['medicationOrderId', 'timestamp'],
      onConflict: 'ignore',
    },
  },

  visit: {
    columns: {
      id: 'CHAR(12) PRIMARY KEY',
      discharged: 'CHAR(19) NOT NULL',
      mrn: 'CHAR(8) NOT NULL',
    },
  },

  waste: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      providerAdcId: 'INTEGER REFERENCES ProviderAdc(id) NOT NULL',
      medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
      medicationProductId: 'INTEGER REFERENCES medicationProduct(id) NOT NULL',
      waste: 'FLOAT NOT NULL',
      timestamp: 'CHAR(19) NOT NULL',
    },
    unique: {
      columns: ['medicationOrderId', 'timestamp'],
      onConflict: 'ignore',
    },
  },

  withdrawal: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      providerAdcId: 'INTEGER REFERENCES ProviderAdc(id) NOT NULL',
      medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
      medicationProductId: 'INTEGER REFERENCES medicationProduct(id) NOT NULL',
      amount: 'INT NOT NULL',
      timestamp: 'CHAR(19) NOT NULL',
    },
    unique: {
      columns: ['medicationOrderId', 'timestamp'],
      onConflict: 'ignore',
    },
  },
};

db.initialize = function initialize() {
  Object.entries(schema).forEach(([table, parameters]) => {
    const columns = Object.entries(parameters.columns)
      .map(([column, constraint]) => `${column} ${constraint}`)
      .join(', ');

    const unique = parameters.unique
      ? `, UNIQUE (${parameters.unique.columns.join(
          ', ',
        )}) ON CONFLICT ${parameters.unique.onConflict.toUpperCase()}`
      : '';

    const stmt = this.prepare(`
      CREATE TABLE IF NOT EXISTS ${table}
      (${columns}${unique});
      `);

    stmt.run();
  });
};

db.initialize();

const medications = [
  'Fentanyl',
  'Hydrocodone–Homatropine',
  'Hydromorphone',
  'Morphine',
  'Oxycodone',
  'Oxycodone–Acetaminophen',
];

db.create = function create(table, parameters) {
  const onConflict = parameters.onConflict ? `OR ${parameters.onConflict.toUpperCase()} ` : '';
  const columns = Object.keys(parameters.data).join(', ');
  const values = Object.values(parameters.data);
  const valuePlaceholders = values.map(() => '?').join(', ');

  const stmt = this.prepare(`
    INSERT ${onConflict}INTO ${table} (${columns})
    VALUES (${valuePlaceholders});
    `);

  stmt.run(...values);
};

db.read = function read(table, parameters) {
  const isDistinct = parameters.isDistinct ? 'DISTINCT ' : '';
  const columns = parameters.columns;

  const where = Object.entries(parameters.where)
    .map(([column, condition]) => `${column} ${condition}`)
    .join(', ');

  const join = parameters.join
    ? Object.entries(parameters.join)
        .map(([joinTable, joinConstraint]) => `INNER JOIN ${joinTable} ON ${joinConstraint}`)
        .join(' ')
    : '';

  const [orderDirection, orderColumns] = parameters.order
    ? Object.entries(parameters.order)
    : [null, null];

  const order = parameters.order ? `ORDER BY ${orderColumns.join(', ')} ${orderDirection}` : '';

  const limit = parameters.limit ? `LIMIT ${parameters.limit}` : '';

  const stmt = this.prepare(`
    SELECT ${isDistinct}${columns}
    FROM ${table}
    WHERE ${where}
    ${join}
    ${order}
    ${limit};
  `);

  if (parameters.columns.length === 1 && /id/i.test(parameters.columns[0])) {
    return stmt.get();
  }

  return stmt.all();
};

db.update = function update(table, parameters) {
  const onConflict = parameters.onConflict ? `OR ${parameters.onConflict.toUpperCase()} ` : '';

  const set = Object.keys(parameters.set)
    .map(column => `${column} = ?`)
    .join(', ');

  const values = Object.values(parameters.set);

  const where = Object.entries(parameters.where)
    .map(([column, condition]) => `${column} ${condition}`)
    .join(', ');

  const stmt = this.prepare(`
  UPDATE ${onConflict}${table}
  SET ${set}
  WHERE ${where};
  `);

  stmt.run(...values);
};

db.delete = function delet(table, parameters) {
  const where = Object.entries(parameters.where)
    .map(([column, condition]) => `${column} ${condition}`)
    .join(', ');

  const stmt = this.prepare(`
  DELETE FROM ${table}
  WHERE ${where};
  `);

  stmt.run();
};


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
  if (/milligram/i.test(string)) {
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

const getTransactionType = string => {
  switch (string) {
    case 'WITHDRAWN':
      return 'withdrawal';

    case 'RESTOCKED':
      return 'restock';

    case 'RETURNED':
      return 'return';

    default:
      return null;
  }
};

// const adcData = fs.createReadStream(`file://${this.state.adcFilePath}`);

// const adcWorkbook = new Excel.Workbook();
// adcWorkbook.xlsx
//   .read(adcData)
//   .then(() => {
//     const getTimestamp = (date, time) => {
//       const [month, day, year] = date.split(/\//);
//       return `'${year}/${month}/${day}T${time}'`;
//     };

//     const worksheet = adcWorkbook.getWorksheet(1);
//     worksheet.eachRow((row, rowNumber) => {
//       const headerRowNumber = 11;
//       const transactionType = getTransactionType(row.getCell('E').value);

//       if (rowNumber > headerRowNumber && transactionType) {
//         const strength = row.getCell('O').value;
//         const units = getUnits(row.getCell('P').value);
//         const form = getForm(row.getCell('C').value);
//         const medicationOrderId = row.getCell('J').value.slice(1);
//         const amount = row.getCell('D').value;
//         const timestamp = getTimestamp(
//           row.getCell('A').value,
//           row.getCell('B').value
//         );

//         database.serialize(() => {
//           database.create('providerAdc', {
//             onConflict: 'ignore',
//             data: { name: row.getCell('K').value },
//           });

//           const providerAdcId = database.read('providerAdc', {
//             columns: ['id'],
//             where: { name: row.getCell('K').value },
//           });

//           database.create('medicationProductAdc', {
//             onConflict: 'ignore',
//             data: { name: row.getCell('C').value },
//           });

//           const medicationProductAdcId = database.read(
//             'medicationProductAdc',
//             {
//               columns: ['id'],
//               where: { name: row.getCell.toString('C').value },
//             }
//           );

//           const medicationId = database.read('medication', {
//             columns: ['id'],
//             where: { name: getMedication(row.getCell('C').value) },
//           });

//           database.create('medicationProduct', {
//             onConflict: 'ignore',
//             data: {
//               medicationId,
//               strength,
//               units,
//               form,
//               adcId: medicationProductAdcId,
//             },
//           });

//           const medicationProductId = database.read('medicationProduct', {
//             columns: ['id'],
//             where: { adcId: medicationProductAdcId },
//           });

//           database.create(transactionType, {
//             onConflict: 'ignore',
//             data: {
//               providerAdcId,
//               medicationOrderId,
//               medicationProductId,
//               amount,
//               timestamp,
//             },
//           });

//           if (/WASTED/.test(row.getCell('F').value)) {
//             const waste = row.getCell('F').value.split(/\s/)[2];

//             database.create('waste', {
//               onConflict: 'ignore',
//               data: {
//                 providerAdcId,
//                 medicationOrderId,
//                 medicationProductId,
//                 waste,
//                 timestamp,
//               },
//             });
//           }
//         });
//       }
//     });
//   })
//   .then(() => adcData.close())
//   .catch(error => {
//     throw error;
//   });

// const emarData = fs.createReadStream(`file://${this.state.emarFilePath}`);

// const emarWorkbook = new Excel.Workbook();
// emarWorkbook.csv
//   .read(emarData)
//   .then(worksheet => {
//     const getTimestamp = string => {
//       if (!string) {
//         return null;
//       }

//       const [date, time, meridian] = string.split(/\s/);

//       let [month, day, year] = date.split(/\//);
//       month = month.padStart(2, '0');
//       day = day.padStart(2, '0');

//       let [hours, minutes] = time.split(/:/);
//       if (meridian === 'PM' && hours !== '12') {
//         hours = (+hours + 12).toString();
//       } else if (meridian === 'AM' && hours === '12') {
//         hours = '00';
//       } else {
//         hours = hours.padStart(2, '0');
//       }
//       return `${year}/${month}/${day}T${hours}:${minutes}:00`;
//     };

//     worksheet.eachRow((row, rowNumber) => {
//       const headerRowNumber = 7;

//       if (rowNumber > headerRowNumber) {
//         const visitId = row.getCell('F').value;
//         const discharged = getTimestamp(row.getCell('L').value);
//         const mrn = row.getCell('G').value.padStart(8, '0');
//         const medicationOrderId = row.getCell('M').value;
//         let [dose, units] = row.getCell('R').value.split(/\s/);
//         const form = getForm(row.getCell('P').value);
//         units = getUnits(units);
//         const timestamp = getTimestamp(row.getCell('AM'));

//         database.create('visit', {
//           onConflict: 'ignore',
//           data: {
//             id: visitId,
//             discharged,
//             mrn,
//           },
//         });

//         database.serialize(() => {
//           const medicationId = database.read('medication', {
//             columns: ['id'],
//             where: { name: getMedication(row.getCell('O').value) },
//           });

//           database.create('medicationOrder', {
//             onConflict: 'ignore',
//             data: {
//               id: medicationOrderId,
//               medicationId,
//               dose,
//               units,
//               form,
//               visitId,
//             },
//           });

//           database.create('providerEmar', {
//             onConflict: 'ignore',
//             data: {
//               name: row.getCell('AP').value,
//             },
//           });

//           const providerEmarId = database.read('providerEmar', {
//             columns: ['id'],
//             where: { name: row.getCell('AP').value },
//           });

//           database.create('administration', {
//             onConflict: 'ignore',
//             data: { providerEmarId, medicationOrderId, timestamp },
//           });
//         });
//       }
//     });
//   })
//   .then(() => emarData.close())
//   .catch(error => console.error(error));
