const { Op, Sequelize } = require('sequelize');

const createLedger = require('../services/ledger');

const { isArray } = require('../util');

module.exports = ({
  models: { Administration, PainReassessment, Transaction },
}) => {
  return {
    async get(req, res) {
      const parameters = req.query;

      try {
        const administrations = await Administration.findAll({
          attributes: {
            include: [[concatProviderName(), 'providerName']],
          },
          include: [
            {
              association: 'EmarUsername',
              include: [{ association: 'Provider' }],
            },
            {
              association: 'MedicationOrder',
              include: [{ association: 'Medication' }],
            },
          ],
          order: [['date', 'ASC']],
          raw: true,
          where: {
            date: {
              [Op.gte]: parameters.dateStart,
              [Op.lte]: parameters.dateEnd,
            },
          },
        });

        const painReassessments = await PainReassessment.findAll({
          attributes: {
            include: [[concatProviderName(), 'providerName']],
          },
          include: [
            {
              association: 'EmarUsername',
              include: [{ association: 'Provider' }],
            },
            {
              association: 'MedicationOrder',
              include: [{ association: 'Medication' }],
            },
          ],
          order: [['date', 'ASC']],
          raw: true,
          where: {
            date: {
              [Op.gte]: parameters.dateStart,
              [Op.lte]: parameters.dateEnd,
            },
          },
        });

        const transactions = await Transaction.findAll({
          attributes: {
            include: [
              [concatProduct(), 'product'],
              [concatProviderName(), 'providerName'],
            ],
          },
          include: [
            {
              association: 'AdcUsername',
              include: [{ association: 'Provider' }],
            },
            {
              association: 'Product',
              include: [{ association: 'Medication' }],
            },
            {
              association: 'TransactionType',
            },
          ],
          where: {
            date: {
              [Op.gte]: parameters.dateStart,
              [Op.lte]: parameters.dateEnd,
            },
            [Op.and]: [
              Sequelize.where(concatProduct(), {
                [Op.iLike]: `%${parameters.product || ''}%`,
              }),
            ],
          },
          order: [['date', 'ASC']],
          raw: true,
        });

        const {
          otherTransactions,
          wastes,
          withdrawals,
        } = splitByTransactionType(transactions);

        const selectedWithdrawals = withdrawals.filter(withdrawal =>
          isMatchingRecord(
            withdrawal,
            parameters.medicationOrderId,
            parameters.provider
          )
        );

        const ledger = createLedger({
          administrations,
          otherTransactions,
          painReassessments,
          selectedWithdrawals,
          wastes,
          withdrawals,
        });

        const records = ledger.filter(record =>
          isMatchingRecord(
            record,
            parameters.medicationOrderId,
            parameters.provider
          )
        );

        res.status(200).json(records);
      } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
      }
    },
  };
};

function concatProduct() {
  return Sequelize.fn(
    'concat',
    Sequelize.col('name'),
    ' ',
    Sequelize.col('strength'),
    ' ',
    Sequelize.col('units'),
    ' ',
    Sequelize.col('form')
  );
}

function splitByTransactionType(transactions) {
  return {
    otherTransactions: transactions.filter(transaction =>
      isType(transaction, ['Restock', 'Return'])
    ),
    wastes: transactions.filter(transaction => isType(transaction, 'Waste')),
    withdrawals: transactions.filter(transaction =>
      isType(transaction, 'Withdrawal')
    ),
  };
}

function isType(transaction, matchedType) {
  const type = transaction['TransactionType.value'];

  if (isArray(matchedType)) {
    const pattern = matchedType.join('|');
    const regex = new RegExp(pattern);

    return regex.test(type);
  }

  return type === matchedType;
}

function isMatchingRecord(record, medicationOrderId, provider) {
  return (
    (!medicationOrderId ||
      isMatchingMedicationOrderId(record, medicationOrderId)) &&
    (!provider || isMatchingProvider(record, provider))
  );
}

function isMatchingMedicationOrderId(record, medicationOrderId) {
  const regex = new RegExp(medicationOrderId, 'i');
  return regex.test(record.medicationOrderId);
}

function isMatchingProvider(record, provider) {
  const regex = new RegExp(provider, 'i');
  return regex.test(record.provider);
}

function concatDoseWithUnits() {
  return Sequelize.fn(
    'concat',
    Sequelize.col('dose'),
    ' ',
    Sequelize.col('units')
  );
}

function concatMedicationWithForm() {
  return Sequelize.fn(
    'concat',
    Sequelize.col('name'),
    ' ',
    Sequelize.col('form')
  );
}

function concatProviderName() {
  return Sequelize.fn(
    'concat',
    Sequelize.col('last_name'),
    ', ',
    Sequelize.col('first_name'),
    Sequelize.fn(
      'coalesce',
      Sequelize.fn('concat', ' ', Sequelize.col('middle_initial')),
      ''
    )
  );
}
