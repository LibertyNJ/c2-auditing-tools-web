const fs = require('fs');
const { promisify } = require('util');

const parseAdcReport = require('../services/parse-adc-report');
const parseEmarReport = require('../services/parse-emar-report');

const unlinkAsync = promisify(fs.unlink);

module.exports = ({
  models: {
    AdcUsername,
    Administration,
    EmarUsername,
    Medication,
    MedicationOrder,
    PainReassessment,
    Product,
    ProductDescription,
    Provider,
    Transaction,
    TransactionType,
  },
}) => {
  return {
    async post(req, res) {
      try {
        const adcData = await parseAdcReport(req.files.adcReport[0].path);
        const emarData = await parseEmarReport(req.files.emarReport[0].path);

        adcData.forEach(async row => {
          const medication = await Medication.findOne({
            raw: true,
            where: { name: row.medicationName },
          });

          const [adcUsername] = await AdcUsername.findOrCreate({
            defaults: { providerId: null },
            where: { value: row.adcUsernameValue },
            raw: true,
          });

          const [product] = await Product.findOrCreate({
            where: {
              form: row.form,
              medicationId: medication.id,
              strength: row.strength,
              units: row.units,
            },
            raw: true,
          });

          ProductDescription.create({
            productId: product.id,
            value: row.productDescriptionValue,
          });

          if (hasMedicationOrderId(row)) {
            MedicationOrder.create({
              id: row.medicationOrderId,
              medicationId: medication.id,
            });
          }

          if (isTrackedTransactionType(row)) {
            const transactionType = await TransactionType.findOne({
              raw: true,
              where: { value: row.transactionTypeValue },
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

          if (hasWaste(row)) {
            const transactionType = await TransactionType.findOne({
              raw: true,
              where: { value: 'Waste' },
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
        });

        emarData.forEach(async row => {
          const medication = await Medication.findOne({
            raw: true,
            where: { name: row.medicationName },
          });

          const [emarUsername] = await EmarUsername.findOrCreate({
            defaults: { providerId: null },
            where: { value: row.emarUsernameValue },
            raw: true,
          });

          MedicationOrder.upsert({
            dose: row.dose,
            form: row.form,
            id: row.medicationOrderId,
            medicationId: medication.id,
            units: row.units,
          });

          if (isAdministration(row)) {
            Administration.create({
              date: row.date,
              emarUsernameId: emarUsername.id,
              medicationOrderId: row.medicationOrderId,
            });
          }

          if (isPainReassessment(row)) {
            PainReassessment.create({
              date: row.date,
              emarUsernameId: emarUsername.id,
              medicationOrderId: row.medicationOrderId,
            });
          }
        });

        const adcUsernames = await AdcUsername.findAll({ raw: true });
        const emarUsernames = await EmarUsername.findAll({ raw: true });

        const providerData = emarUsernames.map(emarUsername => {
          const [firstName, lastName, middleInitial] = splitNames(
            emarUsername.value
          );

          return {
            firstName,
            lastName,
            middleInitial,
          };
        });

        await Provider.bulkCreate(providerData, { ignoreDuplicates: true });

        const providers = await Provider.findAll({ raw: true });

        emarUsernames.forEach(async emarUsername => {
          const matchingProvider = await providers.find(
            ({ firstName, lastName, middleInitial = null }) =>
              `${lastName}, ${firstName}${
                middleInitial ? ` ${middleInitial}` : ''
              }` === emarUsername.value
          );

          if (matchingProvider) {
            EmarUsername.update(
              {
                providerId: matchingProvider.id,
              },
              {
                where: { id: emarUsername.id },
              }
            );
          }
        });

        adcUsernames.forEach(async adcUsername => {
          const matchingProvider = await providers.find(
            ({ firstName, lastName, middleInitial = null }) => {
              const regex = new RegExp(adcUsername.value, 'i');

              return regex.test(
                `${lastName}, ${firstName}${
                  middleInitial ? ` ${middleInitial}` : ''
                }`
              );
            }
          );

          if (matchingProvider) {
            AdcUsername.update(
              {
                providerId: matchingProvider.id,
              },
              {
                where: { id: adcUsername.id },
              }
            );
          }
        });

        deleteFiles(req.files);

        res.status(200).send();
      } catch (error) {
        console.error(error);
      }
    },
  };
};

function deleteFiles(files) {
  Object.values(files).forEach(field => {
    field.forEach(file => {
      unlinkAsync(file.path);
    });
  });
}

function splitNames(name) {
  const [lastName, remainder] = name.split(', ');
  const middleInitial = hasMiddleInitial(remainder)
    ? extractMiddleInitial(remainder)
    : null;
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

function hasMedicationOrderId({ medicationOrderId }) {
  return medicationOrderId !== null && medicationOrderId !== 'OVERRIDE';
}

function isAdministration({ isNonMedAdminTask }) {
  return isNonMedAdminTask === 'N';
}

function isPainReassessment({ medName }) {
  return /^Reassess Pain Response/.test(medName);
}

function isTrackedTransactionType({ transactionTypeValue }) {
  return /Restock|Return|Withdrawal/.test(transactionTypeValue);
}

function hasWaste({ waste = '' }) {
  return /AMT WASTED/.test(waste);
}
