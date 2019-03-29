import sqlite3 from 'sqlite3';

sqlite3.verbose();

const database = {
  file: `${__dirname}/data/database.db`,

  schema: {
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
        medicationProductId:
          'INTEGER REFERENCES medicationProduct(id) NOT NULL',
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
        medicationProductId:
          'INTEGER REFERENCES medicationProduct(id) NOT NULL',
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
        medicationProductId:
          'INTEGER REFERENCES medicationProduct(id) NOT NULL',
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
        medicationProductId:
          'INTEGER REFERENCES medicationProduct(id) NOT NULL',
        amount: 'INT NOT NULL',
        timestamp: 'CHAR(19) NOT NULL',
      },
      unique: {
        columns: ['medicationOrderId', 'timestamp'],
        onConflict: 'ignore',
      },
    },
  },

  medications: [
    'Fentanyl',
    'Hydrocodone–Homatropine',
    'Hydromorphone',
    'Morphine',
    'Oxycodone',
    'Oxycodone–Acetaminophen',
  ],

  open() {
    this.db = new sqlite3.Database(this.file, err => {
      if (err) {
        throw err;
      }
    });
  },

  close() {
    this.db.close(err => {
      if (err) {
        throw err;
      }
    });
  },

  clean() {
    this.db.run('VACUUM;', err => {
      if (err) {
        throw err;
      }
    });
  },

  serialize(callback) {
    if (callback) {
      this.db.serialize(() => {
        callback();
      });
    } else {
      this.db.serialize();
    }
  },

  parallelize(callback) {
    if (callback) {
      this.db.parallelize(() => {
        callback();
      });
    } else {
      this.db.parallelize();
    }
  },

  initialize() {
    this.open();
    this.serialize();

    Object.entries(this.schema).forEach(([tableName, parameters]) =>
      this.createTable(tableName, parameters)
    );

    this.medications.forEach(medication => {
      this.create('medication', {
        onConflict: 'ignore',
        data: {
          name: medication,
        },
      });
    });

    this.clean();

    this.close();
  },

  createTable(tableName, parameters) {
    const columns = Object.entries(parameters.columns)
      .map(([column, constraint]) => `${column} ${constraint}`)
      .join(', ');

    const unique = parameters.unique
      ? `, UNIQUE (${parameters.unique.columns.join(
          ', '
        )}) ON CONFLICT ${parameters.unique.onConflict.toUpperCase()}`
      : '';

    this.db.run(
      `
      CREATE TABLE IF NOT EXISTS ${tableName}
      (${columns}${unique});
      `,
      [],
      err => {
        if (err) {
          throw err;
        }
      }
    );
  },

  create(tableName, parameters) {
    const conflict = parameters.onConflict
      ? `OR ${parameters.onConflict.toUpperCase()} `
      : '';

    const columns = Object.keys(parameters.data).join(', ');
    const values = Object.values(parameters.data)
      .map(value => {
        if (typeof value === 'string') {
          return `'${value}'`;
        }

        return value;
      })
      .join(', ');

    this.db.run(
      `
      INSERT ${conflict}INTO ${tableName}
      (${columns})
      VALUES(${values});
      `,
      [],
      function(err) {
        if (err) {
          throw err;
        }

        console.log(`Created record with ID ${this.lastID} in ${tableName}.`);
      }
    );
  },

  read(tableName, parameters) {
    const distinct = parameters.isDistinct ? 'DISTINCT ' : '';
    const columns = parameters.columns.join(', ');

    const where = Object.entries(parameters.where)
      .map(([column, condition]) => `${column} ${condition}`)
      .join(', ');

    const join = parameters.join
      ? Object.entries(parameters.join)
          .map(
            ([joinTable, joinConstraint]) =>
              `INNER JOIN ${joinTable} ON ${joinConstraint}`
          )
          .join(' ')
      : '';

    const [orderDirection, orderColumns] = parameters.order
      ? Object.entries(parameters.order)
      : [null, null];

    const order = parameters.order
      ? `ORDER BY ${orderColumns.join(', ')} ${orderDirection}`
      : '';

    const limit = parameters.limit ? `LIMIT ${parameters.limit}` : '';

    if (parameters.columns.length === 1 && /id/i.test(parameters.columns[0])) {
      this.db.get(
        `
        SELECT ${columns}
        FROM ${tableName}
        WHERE ${where}
        `,
        [],
        (err, row) => {
          if (err) {
            throw err;
          }

          return row.id;
        }
      );
    }

    this.db.all(
      `
      SELECT ${distinct}${columns}
      FROM ${tableName}
      WHERE ${where}
      ${join}
      ${order}
      ${limit};
      `,
      [],
      (err, rows) => {
        if (err) {
          throw err;
        }

        return rows;
      }
    );
  },

  update(tableName, parameters) {
    const conflict = parameters.onConflict
      ? `OR ${parameters.onConflict.toUpperCase()} `
      : '';

    const set = Object.entries(parameters.set)
      .map(([column, value]) => `${column} = ${value}`)
      .join(', ');

    const where = Object.entries(parameters.where)
      .map(([column, condition]) => `${column} ${condition}`)
      .join(', ');

    this.db.run(
      `
      UPDATE ${conflict}${tableName}
      SET ${set}
      WHERE ${where};
      `,
      [],
      function(err) {
        if (err) {
          throw err;
        }
        console.log(`Updated ${this.changes} records in ${tableName}.`);
      }
    );
  },

  delete(tableName, parameters) {
    const where = Object.entries(parameters.where)
      .map(([column, condition]) => `${column} ${condition}`)
      .join(', ');

    this.db.run(
      `
      DELETE FROM ${tableName}
      WHERE ${where};
      `,
      [],
      function(err) {
        if (err) {
          throw err;
        }
        console.log(`Deleted ${this.changes} records from ${tableName}.`);
      }
    );
  },
};

export default database;
