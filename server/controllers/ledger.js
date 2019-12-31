const { Op, Sequelize } = require('sequelize');

const createLedger = require('../services/ledger');

module.exports = ({
  models: { Administration, PainReassessment, Transaction },
}) => {
  return {
    async get(req, res) {
      const parameters = req.body;

      const administrations = await Administration.findAll({
        attributes: {
          include: [
            'date',
            [concatDoseWithUnits(), 'dose_with_units'],
            'medication_order_id',
            [concatMedicationWithForm(), 'medication_with_form'],
            [concatProviderName(), 'provider_name'],
          ],
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
        where: {
          [Op.and]: [
            Sequelize.where(concatProduct(), {
              [Op.iLike]: `%${parameters.product}%`,
            }),
          ],
          date: {
            [Op.gte]: parameters.dateStart,
            [Op.lte]: parameters.dateEnd,
          },
        },
        order: [['date', 'ASC']],
        raw: true,
      });

      const painReassessments = await PainReassessment.findAll({
        attributes: {
          include: [
            'date',
            [concatDoseWithUnits(), 'dose_with_units'],
            'medication_order_id',
            [concatMedicationWithForm(), 'medication_with_form'],
            [concatProviderName(), 'provider_name'],
          ],
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
        where: {
          [Op.and]: [
            Sequelize.where(concatProduct(), {
              [Op.iLike]: `%${parameters.product}%`,
            }),
          ],
          date: {
            [Op.gte]: parameters.dateStart,
            [Op.lte]: parameters.dateEnd,
          },
        },
        order: [['date', 'ASC']],
        raw: true,
      });

      const transactions = await Transaction.findAll({
        attributes: {
          include: [
            'amount',
            'date',
            ['$Medication.name$', 'medication'],
            'medication_order_id',
            [concatProduct(), 'product'],
            [concatProviderName(), 'provider_name'],
            'type',
          ],
        },
        include: [
          {
            association: 'AdcUsername',
            include: [{ association: 'Provider' }],
          },
          {
            association: 'MedicationProduct',
            include: [{ association: 'Medication' }],
          },
          {
            association: 'TransactionType',
          },
        ],
        where: {
          [Op.and]: [
            Sequelize.where(concatProduct(), {
              [Op.iLike]: `%${parameters.product}%`,
            }),
          ],
          date: {
            [Op.gte]: parameters.dateStart,
            [Op.lte]: parameters.dateEnd,
          },
        },
        order: [['date', 'ASC']],
        raw: true,
      });

      const ledger = createLedger(selectedWithdrawals, {
        administrations,
        otherTransactions,
        painReassessments,
        wastes,
        withdrawals,
      });

      res.status(200).json(ledger);
    },
  };
};

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

function concatProviderName() {
  return Sequelize.fn(
    'concat',
    Sequelize.col('last_name'),
    ', ',
    Sequelize.col('first_name'),
    Sequelize.fn(
      'coalesce',
      Sequelize.fn('concat', ' ', Sequelize.col('middle_initial'))
    )
  );
}
