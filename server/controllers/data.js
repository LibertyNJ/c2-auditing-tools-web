module.exports = ({ models: {AdcUsername, Administration, EmarUsername, Medication, MedicationOrder, PainReassessment, Product, ProductDescription, Transaction} }) => {
  return {
    async post(req, res) {
      const adcData = parseAdc();

      adcData.forEach(async row => {
        const medication = await Medication.findOne({
          raw: true,
          where: {name: row.medicationName},
        });

        const [adcUsername] = await AdcUsername.findOrCreate({
          defaults: {providerId: null},
          where: {value: row.adcUsername}, 
        });

        const [product] = await Product.findOrCreate({
          where: {
            form: row.form, 
            medicationId: medication.id, 
            strength: row.strength, 
            units: row.units
          }
        });

        ProductDescription.create({
          productId: product.id, 
          value: row.productDescription
        });

        if(hasMedicationOrderId(row)) {
          MedicationOrder.create({
            id: row.medicationOrderId, 
            medicationId: medication.id
          });
        }

        if(isTrackedTransactionType(row)) {
          const transactionType = TransactionType.findOne({
            raw: true,
            where: {value: row.transactionType}
          });

          Transaction.create({
            adcUsernameId: adcUsername.id, 
            amount: row.amount, 
            date: row.date, 
            medicalRecordNumber: row.medicalRecordNumber, 
            medicationOrderId: row.medicationOrderId, 
            productId: product.id,
            typeId: transactionType.id,
          });
        }

        if(hasWaste(row)) {
          const transactionType = TransactionType.findOne({
            raw: true,
            where: {value: 'Waste'}
          });

          Transaction.create({
            adcUsernameId: adcUsername.id, 
            amount: row.amount, 
            date: row.date, 
            medicalRecordNumber: row.medicalRecordNumber, 
            medicationOrderId: row.medicationOrderId, 
            productId: product.id,
            typeId: transactionType.id,
          });
        }
      })

      const emarData = parseEmar();

      emarData.forEach(async row => {
        const medication = await Medication.findOne({
          raw: true,
          where: {name: row.medicationName},
        });

        const [emarUsername] = await EmarUsername.findOrCreate({
          providerId: null,
          value: row.adcUsername
        });

        MedicationOrder.upsert({
          dose: row.dose,
          form: row.form,
          id: row.medicationOrderId, 
          medicationId: medication.id,
          units: row.units,
        });

        if(isAdministration(row)) {
          Administration.create({
            date: row.date,
            emarUsernameId: emarUsername.id,
            medicationOrderId: row.medicationOrderId,
          });
        }

        if(isPainReassessment(row)) {
          PainReassessment.create({
            date: row.date,
            emarUsernameId: emarUsername.id,
            medicationOrderId: row.medicationOrderId,
          });
        }
      })

      const adcUsernames = await AdcUsername.findAll();
      const emarUsernames = await EmarUsername.findAll();

      const providerData = emarUsernames.map(emarUsername => {
        const [firstName, lastName, middleInitial] = splitNames(emarUsername.value);

        return {
          firstName,
          lastName,
          middleInitial,
        }
      })

      await Provider.bulkCreate(providerData, {ignoreDuplicates: true});

      const providers = await Provider.findAll({raw: true});

      emarUsernames.forEach(emarUsername => {
        const matchingProvider = providers.find(provider => provider.fullName === emarUsername.value);

        if (matchingProvider) {
          EmarUsername.update({
            providerId: matchingProvider.id
          }, 
          {
            where: {id: emarUsername.id} 
          });
        }
      })

      res.status(200).send();
    },
  };
};

function splitNames(name) {
  const [lastName, remainder] = name.split(', ');
  const middleInitial = hasMiddleInitial(remainder) ? extractMiddleInitial(remainder) : null;
  const firstName = middleInitial ? extractFirstName(remainder) : remainder;

  return [firstName, lastName, middleInitial];
}

function hasMiddleInitial(remainder) {
  return /\w\s\w$/.test(remainder);
}

function extractMiddleInitial(remainder) {
  return remainder.match(/\w$/)[0];
}

function extractFirstName(remainder) {
  const MIDDLE_INITIAL_LENGTH = 2;
  const firstNameLength = remainder.length - MIDDLE_INITIAL_LENGTH;
  const FIRST_NAME_START = 0;

  return remainder.slice(FIRST_NAME_START, firstNameLength);
}
