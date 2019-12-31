const { Op, Sequelize } = require('sequelize');

module.exports = ({ models: { AdcUsername, EmarUsername, Provider } }) => {
  return {
    async get(req, res) {
      const parameters = req.body;

      try {
        const providers = await Provider.findAll({
          attributes: {
            include: [
              'adc_username.value',
              'emar_username.value',
              'first_name',
              'id',
              'last_name',
              'middle_initial',
            ],
          },
          include: [
            { association: 'AdcUsernames' },
            { association: 'EmarUsernames' },
          ],
          where: {
            first_name: {
              [Op.iLike]: `%${parameters.firstName || ''}%`,
            },
            last_name: {
              [Op.iLike]: `%${parameters.lastName || ''}%`,
            },
            middle_initial: {
              [Op.iLike]: `%${parameters.middleInitial || ''}%`,
            },
            '$AdcUsername.value$': {
              [Op.iLike]: `%${parameters.adcUsername || ''}%`,
            },
            '$EmarUsername.value$': {
              [Op.iLike]: `%${parameters.emarUsername || ''}%`,
            },
          },
          order: [[['last_name', 'first_name', 'middle_initial'], 'ASC']],
          raw: true,
        });

        res.status(200).send();
      } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
      }
    },

    async put(req, res) {
      const parameters = req.body;

      try {
        await Provider.update(
          {
            first_name: parameters.firstName,
            last_name: parameters.lastName,
            middle_initial: parameters.middleInitial,
          },
          {
            where: { id: parameters.providerId },
          }
        );

        await AdcUsername.update(
          { providerId: parameters.providerId },
          { where: { [Op.or]: adcUsernameIdsToAssign } }
        );

        await EmarUsername.update(
          { providerId: parameters.providerId },
          { where: { [Op.or]: emarUsernameIdsToAssign } }
        );

        await AdcUsername.update(
          { providerId: null },
          { where: { [Op.or]: adcUsernameIdsToUnassign } }
        );

        await EmarUsername.update(
          { providerId: null },
          { where: { [Op.or]: emarUsernameIdsToUnassign } }
        );

        res.status(200).send();
      } catch (error) {
        res.status(500).send('Something went wrong.');
      }
    },
  };
};
