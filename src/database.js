import sqlite3 from 'sqlite3';

sqlite3.verbose();

const database = {
  file: `${__dirname}/data/database.db`,

  schema: {
    administration: {
      columns: {
        id: 'INTEGER PRIMARY KEY',
        providerId: 'INTEGER REFERENCES provider(id) NOT NULL',
        medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
        timestamp: 'CHAR(19) NOT NULL',
      },
      unique: {
        columns: ['medicationOrderId', 'timestamp'],
        onConflict: 'ignore',
      },
    },

    medicationOrder: {
      columns: {
        id: 'CHAR(9) PRIMARY KEY',
        medication: 'VARCHAR(255) NOT NULL',
        dose: 'FLOAT NOT NULL',
        units: 'VARCHAR(255) NOT NULL',
        form: 'VARCHAR(255) NOT NULL',
        visitId: 'CHAR(12) REFERENCES visit(id) NOT NULL',
      },
    },

    medicationProduct: {
      columns: {
        id: 'INTEGER PRIMARY KEY',
        medication: 'VARCHAR(255) NOT NULL',
        strength: 'INT NOT NULL',
        units: 'VARCHAR(255) NOT NULL',
        form: 'VARCHAR(255) NOT NULL',
        adcId: 'INTEGER REFERENCES medicationProductAdcId(id) UNIQUE NOT NULL',
      },
    },

    medicationProductAdcId: {
      columns: {
        id: 'INTEGER PRIMARY KEY',
        value: 'VARCHAR(255) UNIQUE NOT NULL',
      },
      unique: {
        columns: ['value'],
        onConflict: 'ignore',
      },
    },

    provider: {
      columns: {
        id: 'INTEGER PRIMARY KEY',
        lastName: 'VARCHAR(255) NOT NULL',
        firstName: 'VARCHAR(255) NOT NULL',
        mi: 'CHAR(1)',
        adcId: 'INTEGER REFERENCES providerAdcId(id) UNIQUE',
        emarId: 'INTEGER REFERENCES providerEmarId(id) UNIQUE',
      },
    },

    providerAdcId: {
      columns: {
        id: 'INTEGER PRIMARY KEY',
        value: 'VARCHAR(255) NOT NULL',
      },
      unique: {
        columns: ['value'],
        onConflict: 'ignore',
      },
    },

    providerEmarId: {
      columns: {
        id: 'INTEGER PRIMARY KEY',
        value: 'VARCHAR(255) NOT NULL',
      },
      unique: {
        columns: ['value'],
        onConflict: 'ignore',
      },
    },

    restock: {
      columns: {
        id: 'INTEGER PRIMARY KEY',
        providerId: 'INTEGER REFERENCES provider(id) NOT NULL',
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
        providerId: 'INTEGER REFERENCES provider(id) NOT NULL',
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
        providerId: 'INTEGER REFERENCES provider(id) NOT NULL',
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
        providerId: 'INTEGER REFERENCES provider(id) NOT NULL',
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

  initialize() {
    this.open();

    Object.entries(this.schema).forEach(([tableName, parameters]) =>
      this.createTable(tableName, parameters)
    );

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
    const values = Object.values(parameters.data).join(', ');

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
        console.log(`Created record with ID ${this.lastId} in ${tableName}.`);
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
