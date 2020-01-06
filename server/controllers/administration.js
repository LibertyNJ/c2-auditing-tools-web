const { Op, Sequelize } = require('sequelize');

module.exports = ({ models: { Administration } }) => {
  return {
    async get(req, res) {
      const parameters = req.query;

      try {
        const administrations = await Administration.findAll({
          attributes: {
            include: [
              'date',
              [concatDoseWithUnits(), 'doseWithUnits'],
              'medication_order_id',
              [concatMedicationWithForm(), 'medicationWithForm'],
              [concatProviderName(), 'providerName'],
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
              Sequelize.where(concatMedicationWithForm(), {
                [Op.iLike]: `%${parameters.medication}%`,
              }),
              Sequelize.where(concatProviderName(), {
                [Op.iLike]: `%${parameters.provider}%`,
              }),
            ],
            date: {
              [Op.gte]: parameters.dateStart,
              [Op.lte]: parameters.dateEnd,
            },
            medication_order_id: {
              [Op.iLike]: `%${parameters.medicationOrderId}%`,
            },
          },
          order: [['date', 'ASC']],
          raw: true,
        });

        res.status(200).json(administrations);
      } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
      }
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
