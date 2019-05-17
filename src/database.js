const adcTransactionTypes = require('./scripts/adc-transaction-types');
const databaseSchema = require('./scripts/database-schema.js');
const db = require('./scripts/db');
const medications = require('./scripts/medications');
const parser = require('./scripts/parser');

const isDevMode = process.execPath.match(/[\\/]electron/);

try {
  db.updateStatus('Initializing…');

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
      data: { name: adcTransactionType },
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
  if (isDevMode) {
    console.error(error);
  }

  db.updateStatus('Error');
}

process.on('message', ({ header, body }) => {
  switch (header.type) {
    case 'status':
      if (header.response) {
        process.send({
          header: { type: header.response },
          body: db.status,
        });
      }

      break;

    case 'import':
      db.updateStatus('Importing data…');

      Promise.all([
        parser.parseAdc(db, body.adcPath),
        parser.parseEmar(db, body.emarPath),
        parser.createProviders(db),
      ])
        .then(() => {
          process.send({ header: { type: header.response } });
          db.updateStatus('Ready');
        })
        .catch(error => {
          if (isDevMode) {
            console.error(error);
          }

          db.updateStatus('Error');
        });

      break;

    case 'query':
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

      break;

    case 'update':
      try {
        db.updateStatus('Updating…');
        db.update(body.table, body.parameters);

        if (header.response) {
          process.send({
            header: { type: header.response },
            body: 'Updated successfully.',
          });
        }

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) {
          console.error(error);
        }

        db.updateStatus('Error');
      }

      break;

    case 'ledger':
      try {
        db.updateStatus('Creating ledger…');

        const providerWhere = body.provider
          ? {
              column: 'provider',
              operator: 'LIKE',
              value: `%${body.provider}%`,
            }
          : null;

        const productWhere = body.product
          ? {
              column: 'product',
              operator: 'LIKE',
              value: `%${body.product}%`,
            }
          : null;

        const medicationOrderIdWhere = body.medicationOrderId
          ? {
              column: 'medicationOrderId',
              operator: 'LIKE',
              value: `%${body.medicationOrderId}%`,
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
              value: body.datetimeStart,
            },

            {
              column: 'timestamp',
              operator: '<',
              value: body.datetimeEnd,
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
              value: body.datetimeEnd,
            },

            {
              column: 'timestamp',
              operator: '>',
              value: body.datetimeStart,
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
              value: body.datetimeEnd,
            },

            {
              column: 'timestamp',
              operator: '>',
              value: body.datetimeStart,
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
              value: body.datetimeEnd,
            },

            {
              column: 'timestamp',
              operator: '>',
              value: body.datetimeStart,
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
              value: body.datetimeEnd,
            },

            {
              column: 'timestamp',
              operator: '>',
              value: body.datetimeStart,
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
                // Due to Pyxis and Sunrise clock variance, allows administration up to five minutes prior to withdrawal.
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
          header: { type: header.response },
          body: result.reverse(),
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) {
          console.error(error);
        }

        db.updateStatus('Error');
      }
      break;

    case 'transaction':
      try {
        db.updateStatus('Reading…');

        const datetimeStart = body.datetimeStart
          ? {
              column: 'timestamp',
              operator: '>',
              value: body.datetimeStart,
            }
          : null;

        const datetimeEnd = body.datetimeEnd
          ? {
              column: 'timestamp',
              operator: '<',
              value: body.datetimeEnd,
            }
          : null;

        const transactionTypes = body.transactionTypes
          ? body.transactionTypes.map(transactionType => ({
              column: 'adcTransactionType.name',
              operator: '=',
              value: transactionType,
            }))
          : null;

        const provider = body.provider
          ? {
              column: 'provider',
              operator: 'LIKE',
              value: `%${body.provider}%`,
            }
          : null;

        const product = body.product
          ? {
              column: 'product',
              operator: 'LIKE',
              value: `%${body.product}%`,
            }
          : null;

        const medicationOrderId = body.medicationOrderId
          ? {
              column: 'medicationOrderId',
              operator: 'LIKE',
              value: `%${body.medicationOrderId}%`,
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

        process.send({
          header: { type: header.response },
          body: result,
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) {
          console.error(error);
        }

        db.updateStatus('Error');
      }

      break;

    case 'administration':
      try {
        db.updateStatus('Reading…');

        const datetimeStart = body.datetimeStart
          ? {
              column: 'timestamp',
              operator: '>',
              value: body.datetimeStart,
            }
          : null;

        const datetimeEnd = body.datetimeEnd
          ? {
              column: 'timestamp',
              operator: '<',
              value: body.datetimeEnd,
            }
          : null;

        const provider = body.provider
          ? {
              column: 'provider',
              operator: 'LIKE',
              value: `%${body.provider}%`,
            }
          : null;

        const medication = body.medication
          ? {
              column: 'medication',
              operator: 'LIKE',
              value: `%${body.medication}%`,
            }
          : null;

        const medicationOrderId = body.medicationOrderId
          ? {
              column: 'medicationOrderId',
              operator: 'LIKE',
              value: `%${body.medicationOrderId}%`,
            }
          : null;

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

        process.send({
          header: { type: header.response },
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

        const lastName = body.lastName
          ? {
              column: 'lastName',
              operator: 'LIKE',
              value: `%${body.lastName}%`,
            }
          : null;

        const firstName = body.firstName
          ? {
              column: 'firstName',
              operator: 'LIKE',
              value: `%${body.firstName}%`,
            }
          : null;

        const middleInitial = body.middleInitial
          ? {
              column: 'middleInitial',
              operator: 'LIKE',
              value: `%${body.middleInitial}%`,
            }
          : null;

        const adcId = body.adcId
          ? {
              column: 'providerAdc.name',
              operator: 'LIKE',
              value: `%${body.adcId}%`,
            }
          : null;

        const emarId = body.emarId
          ? {
              column: 'providerEmar.name',
              operator: 'LIKE',
              value: `%${body.emarId}%`,
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
          header: { type: header.response },
          body: result,
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) {
          console.error(error);
        }

        db.updateStatus('Error');
      }

      break;

    case 'dashboard':
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
              emarAdministrationTimestamps[
                emarAdministrationTimestamps.length - 1
              ].timestamp,
          },
        });

        db.updateStatus('Ready');
      } catch (error) {
        if (isDevMode) {
          console.error(error);
        }

        db.updateStatus('Error');
      }
      break;

    default:
      db.updateStatus('Error');
  }
});
