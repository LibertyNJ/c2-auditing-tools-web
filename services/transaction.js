const { Op } = require('sequelize');

module.exports = async (parameters = {}, Transaction) => {
  const transactions = await Transaction.findAll({
    include: [
      {
        association: 'AdcUsername',
        include: [
          {
            association: 'Provider',
            where: {
              fullName: {
                [Op.iLike]: `%${parameters.provider}%`,
              },
            },
          },
        ],
      },
      {
        association: 'Order',
        where: {
          id: {
            [Op.iLike]: `%${parameters.orderId}%`,
          },
        },
      },
      {
        association: 'Product',
        where: {
          name: {
            [Op.iLike]: `%${parameters.product}%`,
          },
        },
      },
      {
        association: 'TransactionType',
        where: {
          value: {
            [Op.in]: [parameters.transactionTypes],
          },
        },
      },
    ],
    raw: true,
    where: {
      [Op.and]: [
        { date: { [Op.gte]: parameters.dateStart } },
        { date: { [Op.lte]: parameters.dateEnd } },
      ],
    },
  });

  return transactions;
};
