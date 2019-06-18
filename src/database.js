const adcTransactionTypes = require('./config/adc-transaction-types');
const databaseSchema = require('./config/database-schema.js');
const db = require('./scripts/db');
const medications = require('./config/medications');
const parser = require('./scripts/parser');

const isDevMode = process.execPath.match(/[\\/]electron/);

try {
  initializeDatabase();
} catch (error) {
  if (isDevMode) {
    console.error(error);
  }

  db.updateStatus('Error');
}

function initializeDatabase() {
  db.updateStatus('Initializing…');
  createDatabaseTables();
  createMedications();
  createADCTransactionTypes();
  createOverrideMedicationOrder();
  db.updateStatus('Ready');
}

function createDatabaseTables() {
  Object.entries(databaseSchema).forEach(([table, definition]) => {
    const columns = Object.entries(definition.columns)
      .map(([column, constraint]) => `${column} ${constraint}`)
      .join(', ');
    const uniqueStatements = definition.unique
      ? definition.unique.columns.join(', ')
      : null;
    const onConflictStatement = definition.unique
      ? definition.unique.onConflict.toUpperCase()
      : null;
    const unique =
      uniqueStatements && onConflictStatement
        ? `, UNIQUE (${uniqueStatements}) ON CONFLICT ${onConflictStatement}`
        : '';

    const statement = db.prepare(
      `
      CREATE TABLE IF NOT EXISTS ${table}
      (${columns}${unique});
      `
    );
    statement.run();
  });
}

function createMedications() {
  medications.forEach(medication => {
    db.create('medication', {
      onConflict: 'ignore',
      data: { name: medication },
    });
  });
}

function createADCTransactionTypes() {
  adcTransactionTypes.forEach(adcTransactionType => {
    db.create('adcTransactionType', {
      onConflict: 'ignore',
      data: { name: adcTransactionType },
    });
  });
}

function createOverrideMedicationOrder() {
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
}

process.on('message', ({ channel, message }) => {
  switch (channel) {
    case 'administration':
      handleAdministrationRequest(message);
      break;
    case 'dashboard':
      handleDashboardRequest(message);
      break;
    case 'import':
      handleImportRequest(message);
      break;
    case 'ledger':
      handleLedgerRequest(message);
      break;
    case 'provider':
      handleProviderRequest(message);
      break;
    case 'status':
      handleStatusRequest();
      break;
    case 'transaction':
      handleTransactionRequest(message);
      break;
    case 'updateProviderAdcs':
      HandleUpdateProviderAdcsRequest(message);
      break;
    default:
      throw new Error('Database process received request on invalid channel.');
  }
});

function handleAdministrationRequest(message) {
  try {
    db.updateStatus('Reading…');

    const datetimeStart = {
      column: 'timestamp',
      operator: '>',
      value: message.datetimeStart,
    };
    const datetimeEnd = {
      column: 'timestamp',
      operator: '<',
      value: message.datetimeEnd,
    };
    const provider = {
      column: 'provider',
      operator: 'LIKE',
      value: `%${message.provider}%`,
    };
    const medication = {
      column: 'medication',
      operator: 'LIKE',
      value: `%${message.medication}%`,
    };
    const medicationOrderId = {
      column: 'medicationOrderId',
      operator: 'LIKE',
      value: `%${message.medicationOrderId}%`,
    };

    const result = db.read('emarAdministration', {
      columns: [
        'emarAdministration.id',
        'timestamp',
        "provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider",
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

    sendResponseToRendererProcess('administration', result);
    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }
}

function handleDashboardRequest(message) {
  try {
    db.updateStatus('Querying dashboard…');

    const unassignedAdcIds = db.read('providerAdc', {
      columns: ['*'],
      wheres: [
        {
          column: 'providerId',
          operator: 'IS',
          value: null,
        },
      ],
    });
    const unassignedEmarIds = db.read('providerEmar', {
      columns: ['*'],
      wheres: [
        {
          column: 'providerId',
          operator: 'IS',
          value: null,
        },
      ],
    });
    const adcTransactionTimestamps = db.read('adcTransaction', {
      isDistinct: true,
      columns: ['timestamp'],
      wheres: [
        {
          column: 1,
          operator: '=',
          value: 1,
        },
      ],
      orderBys: [
        {
          column: 'timestamp',
          direction: 'ASC',
        },
      ],
    });
    const emarAdministrationTimestamps = db.read('emarAdministration', {
      isDistinct: true,
      columns: ['timestamp'],
      wheres: [
        {
          column: 1,
          operator: '=',
          value: 1,
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
      header: { type: header.response },

      body: {
        unassignedAdcIds: unassignedAdcIds ? unassignedAdcIds.length : 0,
        unassignedEmarIds: unassignedEmarIds ? unassignedEmarIds.length : 0,
        earliestAdcData: adcTransactionTimestamps[0].timestamp,
        earliestEmarData: emarAdministrationTimestamps[0].timestamp,

        latestAdcData:
          adcTransactionTimestamps[adcTransactionTimestamps.length - 1]
            .timestamp,

        latestEmarData:
          emarAdministrationTimestamps[emarAdministrationTimestamps.length - 1]
            .timestamp,
      },
    });

    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }
}

function handleProviderRequest(message) {
  try {
    db.updateStatus('Reading…');

    const lastName = message.lastName
      ? {
          column: 'lastName',
          operator: 'LIKE',
          value: `%${message.lastName}%`,
        }
      : null;
    const firstName = message.firstName
      ? {
          column: 'firstName',
          operator: 'LIKE',
          value: `%${message.firstName}%`,
        }
      : null;
    const middleInitial = message.middleInitial
      ? {
          column: 'middleInitial',
          operator: 'LIKE',
          value: `%${message.middleInitial}%`,
        }
      : null;
    const adcId = message.adcId
      ? {
          column: 'providerAdc.name',
          operator: 'LIKE',
          value: `%${message.adcId}%`,
        }
      : null;
    const emarId = message.emarId
      ? {
          column: 'providerEmar.name',
          operator: 'LIKE',
          value: `%${message.emarId}%`,
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

    sendResponseToRendererProcess('provider', result);
    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }
}

function handleStatusRequest() {
  try {
    sendResponseToRendererProcess('status', db.status);
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }
}

async function handleImportRequest({ adcPath, emarPath }) {
  try {
    db.updateStatus('Importing data…');
    await parser.parseAdc(db, adcPath);
    await parser.parseEmar(db, emarPath);
    await parser.createProviders(db);
    sendResponseToRendererProcess('import');
    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }
}

function handleLedgerRequest(message) {
  try {
    db.updateStatus('Creating ledger…');

    const providerWhere = message.provider
      ? {
          column: 'provider',
          operator: 'LIKE',
          value: `%${message.provider}%`,
        }
      : null;
    const productWhere = message.product
      ? {
          column: 'product',
          operator: 'LIKE',
          value: `%${message.product}%`,
        }
      : null;
    const medicationOrderIdWhere = message.medicationOrderId
      ? {
          column: 'medicationOrderId',
          operator: 'LIKE',
          value: `%${message.medicationOrderId}%`,
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
          value: message.datetimeStart,
        },
        {
          column: 'timestamp',
          operator: '<',
          value: message.datetimeEnd,
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
          direction: 'DESC',
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
          value: message.datetimeEnd,
        },
        {
          column: 'timestamp',
          operator: '>',
          value: message.datetimeStart,
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
          value: message.datetimeEnd,
        },
        {
          column: 'timestamp',
          operator: '>',
          value: message.datetimeStart,
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
          value: message.datetimeEnd,
        },
        {
          column: 'timestamp',
          operator: '>',
          value: message.datetimeStart,
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
          value: message.datetimeEnd,
        },
        {
          column: 'timestamp',
          operator: '>',
          value: message.datetimeStart,
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

    const result = [...withdrawals];
    const adcEmarMillisecondDifferential = 300000; // Due to Pyxis and Sunrise clock variance, allows administration up to five minutes prior to withdrawal.

    result.forEach(withdrawal => {
      if (withdrawal.medicationOrderId === 'OVERRIDE') {
        // Finds the first waste after overridden withdrawal.
        const wasteIndex = wastes.findIndex(
          waste =>
            waste.mrn === withdrawal.mrn &&
            waste.medicationProductId === withdrawal.medicationProductId &&
            waste.timestamp >= withdrawal.timestamp &&
            !waste.reconciled
        );

        if (wastes[wasteIndex]) {
          wastes[wasteIndex].reconciled = true;

          const { amount, units } = wastes[wasteIndex];

          withdrawal.waste = `${amount} ${units}`;
          withdrawal.wasteAmount = amount;
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
                  new Date(withdrawal.timestamp).getTime() -
                    adcEmarMillisecondDifferential &&
                !administration.reconciled
              );
            }

            return (
              administration.medication === withdrawal.medication &&
              administration.mrn === withdrawal.mrn &&
              withdrawal.amount * withdrawal.strength ===
                administration.dose &&
              new Date(administration.timestamp).getTime() >=
                new Date(withdrawal.timestamp).getTime() -
                  adcEmarMillisecondDifferential &&
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
                new Date(administration.timestamp).getTime() + 3600000 && // Up to one hour after administration.
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
          ({ medicationOrderId, timestamp }) =>
            medicationOrderId === withdrawal.medicationOrderId &&
            timestamp > withdrawal.timestamp
        );

        // There can be multiple wastes for a single withdrawal.
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
                    new Date(withdrawal.timestamp).getTime() -
                      adcEmarMillisecondDifferential &&
                  administration.timestamp < nextWithdrawal.timestamp &&
                  !administration.reconciled
                );
              }

              return (
                administration.medicationOrderId ===
                  withdrawal.medicationOrderId &&
                new Date(administration.timestamp).getTime() >=
                  new Date(withdrawal.timestamp).getTime() -
                    adcEmarMillisecondDifferential &&
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
      header: { type: header.response },
      message: result.reverse(),
    });

    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }

}

function handleTransactionRequest(message) {
  try {
    db.updateStatus('Reading…');

    const datetimeStart = message.datetimeStart
      ? {
          column: 'timestamp',
          operator: '>',
          value: message.datetimeStart,
        }
      : null;
    const datetimeEnd = message.datetimeEnd
      ? {
          column: 'timestamp',
          operator: '<',
          value: message.datetimeEnd,
        }
      : null;
    const transactionTypes = message.transactionTypes
      ? message.transactionTypes.map(transactionType => ({
          column: 'adcTransactionType.name',
          operator: '=',
          value: transactionType,
        }))
      : null;
    const provider = message.provider
      ? {
          column: 'provider',
          operator: 'LIKE',
          value: `%${message.provider}%`,
        }
      : null;
    const product = message.product
      ? {
          column: 'product',
          operator: 'LIKE',
          value: `%${message.product}%`,
        }
      : null;
    const medicationOrderId = message.medicationOrderId
      ? {
          column: 'medicationOrderId',
          operator: 'LIKE',
          value: `%${message.medicationOrderId}%`,
        }
      : null;

    const result = db.read('adcTransaction', {
      columns: [
        'adcTransaction.id',
        'timestamp',
        "provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider",
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

    sendResponseToRendererProcess('transaction', result);
    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }
}

function handleUpdateProviderAdcRequest({ parameters }) {
  try {
    db.updateStatus('Updating…');
       const parameters = {
            sets: [
              {
                column: 'providerId',
                value: this.props.providerId,
              },
            ],
            wheres: [
              {
                column: 'id',
                operator: '=',
                value: this.state.addAdcId,
              },
            ],
          }
    db.update('providerAdc', parameters);
    sendResponseToRendererProcess('update', 'Updated successfully.');
    db.updateStatus('Ready');
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }

    db.updateStatus('Error');
  }
}

function sendResponseToRendererProcess(channel, message) {
  process.send({
    channel,
    message,
  });
}

try {
  db.updateStatus('Querying…');
  const records = db.read(body.table, body.parameters);

  if (header.response) {
    process.send({
      header: { type: header.response },
      body: records,
    });
  }

  db.updateStatus('Ready');
} catch (error) {
  if (isDevMode) {
    console.error(error);
  }

  db.updateStatus('Error');
}

function handleModalRequest() {
  table: 'provider',

  const parameters = {
    isDistinct: true,
    columns: [
      'lastName',
      'firstName',
      'middleInitial',
      "(SELECT group_concat(name, '; ') FROM providerAdc WHERE providerId = provider.id) AS adcIds",
      "(SELECT group_concat(name, '; ') FROM providerEmar WHERE providerId = provider.id) AS emarIds",
    ],
    wheres: [
      {
        column: 'provider.id',
        operator: '=',
        value: this.props.providerId,
      },
    ],
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
  }

  db.read()
}
