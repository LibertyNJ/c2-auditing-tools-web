module.exports = [
  {
    name: 'transactionView',
    statement: `
      SELECT adcTransaction.id,
             amount,
             medication.name AS medication,
             medicationOrderId,
             medicationProductId,
             medicationProduct.strength,
             medicationProduct.units,
             medicalRecordNumber,
             medication.name || ', ' || medicationProduct.strength || ' ' || medicationProduct.units || ' ' || medicationProduct.form AS product,
             provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider,
             provider.id AS providerId,
             timestamp,
             adcTransactionType.name AS type
      FROM adcTransaction
      LEFT JOIN providerAdc ON providerAdcId = providerAdc.id
      LEFT JOIN provider ON providerAdc.providerId = provider.id
      LEFT JOIN medicationProduct ON medicationProductId = medicationProduct.id
      LEFT JOIN medication ON medicationProduct.medicationId = medication.Id
      LEFT JOIN adcTransactionType ON typeId = adcTransactionType.id
      ORDER BY timestamp ASC;
    `,
  },
  {
    name: 'administrationView',
    statement: `
      SELECT emarAdministration.id, 
             medicalRecordNumber,
             medication.name AS medication,
             medication.name || ' ' || medicationOrder.form AS medicationWithForm,
             medicationOrder.dose,
             medicationOrder.dose || ' ' || medicationOrder.units AS doseWithUnits,
             medicationOrderId,
             provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider, 
             provider.id AS providerId,
             timestamp
      FROM emarAdministration 
      LEFT JOIN providerEmar ON providerEmarId = providerEmar.id 
      LEFT JOIN provider ON providerEmar.providerId = provider.id 
      LEFT JOIN medicationOrder ON medicationOrderId = medicationOrder.id 
      LEFT JOIN medication ON medicationOrder.medicationId = medication.id
      LEFT JOIN visit ON medicationOrder.visitId = visit.id
      ORDER BY timestamp ASC;
    `,
  },
  {
    name: 'painReassessmentView',
    statement: `
      SELECT emarPainReassessment.id,
             medication.name AS medication,
             medicationOrder.dose,
             medicationOrderId,
             medicalRecordNumber,
             timestamp,
             provider.lastName || ', ' || provider.firstName || ifnull(' ' || provider.middleInitial, '') AS provider,
             provider.id AS providerId
      FROM emarPainReassessment
      LEFT JOIN providerEmar ON providerEmarId = providerEmar.id
      LEFT JOIN provider ON providerEmar.providerId = provider.id
      LEFT JOIN medicationOrder ON medicationOrderId = medicationOrder.id
      LEFT JOIN medication ON medicationOrder.medicationId = medication.id
      LEFT JOIN visit ON medicationOrder.visitId = visit.id
      ORDER BY timestamp ASC;
    `,
  },
  {
    name: 'providerView',
    statement: `
      SELECT DISTINCT (SELECT group_concat(name, '; ') FROM providerAdc WHERE providerId = provider.id) AS adcIds,
                      (SELECT group_concat(name, '; ') FROM providerEmar WHERE providerId = provider.id) AS emarIds,
                      provider.id,
                      firstName,
                      lastName,
                      middleInitial
      FROM provider
      LEFT JOIN providerAdc ON provider.id = providerAdc.providerId
      LEFT JOIN providerEmar ON provider.id = providerEmar.providerId
      ORDER BY lastName, firstName, middleInitial ASC;       
    `,
  },
];
