const { Op, Sequelize } = require('sequelize');

module.exports = ({ models: { AdcUsername, EmarUsername, Provider } }) => {
  return {
    async get(req, res) {
      const parameters = req.query;

      console.log(parameters);

      const whereClause = {
        first_name: {
          [Op.iLike]: `%${parameters.firstName || ''}%`,
        },
        last_name: {
          [Op.iLike]: `%${parameters.lastName || ''}%`,
        },
      };

      if (parameters.middleInitial) {
        whereClause.middle_initial = {
          [Op.iLike]: `%${parameters.middleInitial || ''}%`,
        };
      }

      if (parameters.adcUsername) {
        whereClause['$AdcUsernames.value$'] = {
          [Op.iLike]: `%${parameters.adcUsername || ''}%`,
        };
      }

      if (parameters.emarUsername) {
        whereClause['$EmarUsernames.value$'] = {
          [Op.iLike]: `%${parameters.emarUsername || ''}%`,
        };
      }

      try {
        const providers = await Provider.findAll({
          include: [
            { association: 'AdcUsernames' },
            { association: 'EmarUsernames' },
          ],
          where: whereClause,
          order: [
            ['last_name', 'ASC'],
            ['first_name', 'ASC'],
            ['middle_initial', 'ASC'],
          ],
          raw: true,
        });

        console.log(providers);

        res.status(200).json(providers);
      } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
      }
    },

    async getEdit(req, res) {
      const parameters = req.query;

      try {
        const provider = Provider.findOne({
          raw: true,
          where: {
            id: parameters.id,
          },
        });

        const assignedAdcUsernames = AdcUsername.findAll({
          raw: true,
          where: {
            providerId: parameters.id,
          },
        });

        const assignedEmarUsernames = EmarUsername.findAll({
          raw: true,
          where: {
            providerId: parameters.id,
          },
        });

        const unassignedAdcUsernames = AdcUsername.findAll({
          raw: true,
          where: {
            providerId: null,
          },
        });

        const unassignedEmarUsernames = EmarUsername.findAll({
          raw: true,
          where: {
            providerId: null,
          },
        });

        res.status(200).json({
          provider,
          assignedAdcUsernames,
          assignedEmarUsernames,
          unassignedAdcUsernames,
          unassignedEmarUsernames,
        });
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
            first_name: parameters.editFirstName,
            last_name: parameters.editLastName,
            middle_initial: parameters.editMiddleInitial,
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
