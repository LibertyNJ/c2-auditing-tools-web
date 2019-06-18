module.exports = {
  adcTransaction: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      typeId: 'INTEGER REFERENCES adcTransactionType(id) NOT NULL',
      providerAdcId: 'INTEGER REFERENCES providerAdc(id) NOT NULL',
      medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
      medicationProductId: 'INTEGER REFERENCES medicationProduct(id) NOT NULL',
      amount: 'FLOAT NOT NULL',
      mrn: 'UNSIGNED INT(8)',
      timestamp: 'CHAR(19) NOT NULL',
    },
    unique: {
      columns: ['typeId', 'providerAdcId', 'timestamp'],
      onConflict: 'ignore',
    },
  },

  adcTransactionType: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      name: 'VARCHAR(255) UNIQUE NOT NULL',
    },
  },

  emarAdministration: {
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

  emarPainAssessment: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      providerEmarId: 'INTEGER REFERENCES providerEmar(id) NOT NULL',
      medicationOrderId: 'CHAR(9) REFERENCES medicationOrder(id) NOT NULL',
      byPolicy: 'BOOLEAN NOT NULL',
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
      medicationId: 'INTEGER REFERENCES medication(id)',
      dose: 'FLOAT',
      units: 'VARCHAR(255)',
      form: 'VARCHAR(255)',
      visitId: 'UNSIGNED BIGINT(12) REFERENCES visit(id)',
    },
  },

  medicationProduct: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      medicationId: 'INTEGER REFERENCES medication(id) NOT NULL',
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
      middleInitial: 'CHAR(1)',
    },
    unique: {
      columns: ['lastName', 'firstName', 'middleInitial'],
      onConflict: 'ignore',
    },
  },

  providerAdc: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      name: 'VARCHAR(255) NOT NULL',
      providerId: 'INTEGER REFERENCES provider',
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
      providerId: 'INTEGER REFERENCES provider',
    },
    unique: {
      columns: ['name'],
      onConflict: 'ignore',
    },
  },

  visit: {
    columns: {
      id: 'UNSIGNED BIGINT(12) PRIMARY KEY',
      mrn: 'UNSIGNED INT(8) NOT NULL',
      discharged: 'CHAR(19)',
    },
  },
};
