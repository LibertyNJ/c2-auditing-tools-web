const { Op, Sequelize } = require('sequelize');

module.exports = ({ models: { Transaction } }) => {
  return {
    async get(req, res) {
      const parameters = req.query;

      console.log(parameters);

      try {
        const transactions = await Transaction.findAll({
          attributes: {
            include: [
              'amount',
              'date',
              ['medication_order_id', 'medicationOrderId'],
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
              association: 'MedicationOrder',
              include: [{ association: 'Medication' }],
            },
            { association: 'Product' },
            { association: 'TransactionType' },
          ],
          where: {
            [Op.and]: [
              Sequelize.where(concatProduct(), {
                [Op.iLike]: `%${parameters.product || ''}%`,
              }),
              Sequelize.where(concatProviderName(), {
                [Op.iLike]: `%${parameters.provider || ''}%`,
              }),
              Sequelize.where(Sequelize.col('TransactionType.value'), {
                [Op.in]: parameters.transactionTypes || [],
              }),
            ],
            date: {
              [Op.gte]: parameters.dateStart,
              [Op.lte]: parameters.dateEnd,
            },
            medication_order_id: {
              [Op.iLike]: `%${parameters.medicationOrderId || ''}%`,
            },
          },
          order: [['date', 'ASC']],
          raw: true,
        });

        console.log(transactions);

        res.status(200).json(transactions);
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
    Sequelize.col('Product.units'),
    ' ',
    Sequelize.col('Product.form')
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
