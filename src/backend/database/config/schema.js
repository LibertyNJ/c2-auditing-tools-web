module.exports = [
  {
    name: 'adcTransaction',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'typeId',
        type: 'INTEGER',
        constraint: 'REFERENCES adcTransactionType(id) NOT NULL',
      },
      {
        name: 'providerAdcId',
        type: 'INTEGER',
        constraint: 'REFERENCES providerAdc(id) NOT NULL',
      },
      {
        name: 'medicationOrderId',
        type: 'CHAR(9)',
        constraint: 'REFERENCES medicationOrder(id) NOT NULL',
      },
      {
        name: 'medicationProductId',
        type: 'INTEGER',
        constraint: 'REFERENCES medicationProduct(id) NOT NULL',
      },
      {
        name: 'amount',
        type: 'FLOAT',
        constraint: 'NOT NULL',
      },
      {
        name: 'medicalRecordNumber',
        type: 'UNSIGNED INT(8)',
      },
      {
        name: 'timestamp',
        type: 'CHAR(19)',
        constraint: 'NOT NULL',
      },
    ],
    constraints: [
      {
        type: 'UNIQUE',
        columns: ['typeId', 'providerAdcId', 'timestamp'],
        onConflict: 'IGNORE',
      },
    ],
  },
  {
    name: 'adcTransactionType',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        constraint: 'UNIQUE NOT NULL',
      },
    ],
  },
  {
    name: 'emarAdministration',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'providerEmarId',
        type: 'INTEGER',
        constraint: 'INTEGER REFERENCES providerEmar(id) NOT NULL',
      },
      {
        name: 'medicationOrderId',
        type: 'CHAR(9)',
        constraint: 'REFERENCES medicationOrder(id) NOT NULL',
      },
      {
        name: 'timestamp',
        type: 'CHAR(19)',
        constraint: 'NOT NULL',
      },
    ],
    constraints: [
      {
        type: 'UNIQUE',
        columns: ['medicationOrderId', 'timestamp'],
        onConflict: 'IGNORE',
      },
    ],
  },
  {
    name: 'emarPainReassessment',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'providerEmarId',
        type: 'INTEGER',
        constraint: 'REFERENCES providerEmar(id) NOT NULL',
      },
      {
        name: 'medicationOrderId',
        type: 'CHAR(9)',
        constraint: 'REFERENCES medicationOrder(id) NOT NULL',
      },
      {
        name: 'timestamp',
        type: 'CHAR(19)',
        constraint: 'NOT NULL',
      },
    ],
    constraints: [
      {
        type: 'UNIQUE',
        columns: ['medicationOrderId', 'timestamp'],
        onConflict: 'ignore',
      },
    ],
  },
  {
    name: 'medication',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        constraint: 'UNIQUE NOT NULL',
      },
    ],
  },
  {
    name: 'medicationOrder',
    columns: [
      {
        name: 'id',
        type: 'CHAR(9)',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'medicationId',
        type: 'INTEGER',
        constraint: 'REFERENCES medication(id)',
      },
      {
        name: 'dose',
        type: 'FLOAT',
      },
      {
        name: 'units',
        type: 'VARCHAR(255)',
      },
      {
        name: 'form',
        type: 'VARCHAR(255)',
      },
      {
        name: 'visitId',
        type: 'UNSIGNED BIGINT(12)',
        constraint: 'REFERENCES visit(id)',
      },
    ],
  },
  {
    name: 'medicationProduct',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'medicationId',
        type: 'INTEGER',
        constraint: 'REFERENCES medication(id) NOT NULL',
      },
      {
        name: 'strength',
        type: 'FLOAT',
        constraint: 'NOT NULL',
      },
      {
        name: 'units',
        type: 'VARCHAR(255)',
        constraint: 'NOT NULL',
      },
      {
        name: 'form',
        type: 'VARCHAR(255)',
        constraint: 'NOT NULL',
      },
      {
        name: 'adcId',
        type: 'INTEGER',
        constraint: 'REFERENCES medicationProductAdc(id) UNIQUE NOT NULL',
      },
    ],
  },
  {
    name: 'medicationProductAdc',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        constraint: 'NOT NULL',
      },
    ],
    constraints: [
      {
        type: 'unique',
        columns: ['name'],
        onConflict: 'ignore',
      },
    ],
  },
  {
    name: 'provider',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'lastName',
        type: 'VARCHAR(255)',
        constraint: 'NOT NULL',
      },
      {
        name: 'firstName',
        type: 'VARCHAR(255)',
        constraint: 'NOT NULL',
      },
      {
        name: 'middleInitial',
        type: 'CHAR(1)',
      },
    ],
    constraints: [
      {
        type: 'UNIQUE',
        columns: ['lastName', 'firstName', 'middleInitial'],
        onConflict: 'ignore',
      },
    ],
  },
  {
    name: 'providerAdc',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        constraint: 'NOT NULL',
      },
      {
        name: 'providerId',
        type: 'INTEGER',
        constraint: 'REFERENCES provider(id)',
      },
    ],
    constraints: [
      {
        type: 'UNIQUE',
        columns: ['name'],
        onConflict: 'ignore',
      },
    ],
  },
  {
    name: 'providerEmar',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        constraint: 'NOT NULL',
      },
      {
        name: 'providerId',
        type: 'INTEGER',
        constraint: 'REFERENCES provider(id)',
      },
    ],
    constraints: [
      {
        type: 'UNIQUE',
        columns: ['name'],
        onConflict: 'ignore',
      },
    ],
  },
  {
    name: 'visit',
    columns: [
      {
        name: 'id',
        type: 'UNSIGNED BIGINT(12)',
        constraint: 'PRIMARY KEY',
      },
      {
        name: 'medicalRecordNumber',
        type: 'UNSIGNED INT(8)',
        constraint: 'NOT NULL',
      },
      {
        name: 'discharged',
        type: 'CHAR(19)',
      },
    ],
  },
];
