const reconciledRecords = new WeakSet();

let lastWaste;
let nextWithdrawal;

module.exports = function getLedger({ selectedWithdrawals, ...records }) {
  setRecords(records);
  const ledger = selectedWithdrawals.map(createLedgerRecord);
  return ledger;
};

function setRecords(records) {
  _administrations = [...records.administrations];
  _otherTransactions = [...records.otherTransactions];
  _painReassessments = [...records.painReassessments];
  _wastes = [...records.wastes];
  _withdrawals = [...records.withdrawals];
}

function createLedgerRecord(withdrawal) {
  nextWithdrawal = getNextWithdrawal(withdrawal);
  const waste = getWaste(withdrawal);
  const disposition = getDisposition(withdrawal, waste);
  const painReassessment =
    !!disposition && isAdministration(disposition)
      ? getPainReassessment(withdrawal, disposition)
      : null;
  return {
    dispositionProviderName: disposition ? disposition.providerName : null,
    dispositionDate: disposition ? disposition.date : null,
    dispositionType: disposition ? disposition.type : null,
    painReassessmentProviderName: painReassessment
      ? painReassessment.providerName
      : null,
    painReassessmentDate: painReassessment ? painReassessment.date : null,
    waste: waste ? `${waste.amount} ${waste.units}` : null,
    ...withdrawal,
  };
}

function getNextWithdrawal(currentWithdrawal) {
  return _withdrawals.find(withdrawal =>
    isNextWithdrawal(withdrawal, currentWithdrawal)
  );
}

function isNextWithdrawal(withdrawal, currentWithdrawal) {
  return (
    occurredAfter(withdrawal, currentWithdrawal) &&
    (isOverride(currentWithdrawal) ||
      isSameMedicationOrder(withdrawal, currentWithdrawal)) &&
    (!isOverride(currentWithdrawal) ||
      isSamePatient(withdrawal, currentWithdrawal)) &&
    (!isOverride(currentWithdrawal) ||
      isSameMedicationProduct(withdrawal, currentWithdrawal))
  );
}

function getWaste(withdrawal) {
  const relatedWastes = getRelatedWastes(withdrawal);
  reconcileRecords(relatedWastes);
  lastWaste = getLastWaste(relatedWastes);
  return lastWaste ? createWaste(relatedWastes) : null;
}

function getRelatedWastes(withdrawal) {
  return _wastes.filter(waste => isRelatedWaste(waste, withdrawal));
}

function isRelatedWaste(waste, withdrawal) {
  return (
    !isReconciled(waste) &&
    occurredConcurrentlyOrAfter(waste, withdrawal) &&
    (!hasNextWithdrawal() || occurredBefore(waste, nextWithdrawal)) &&
    (isOverride(withdrawal) || isSameMedicationOrder(waste, withdrawal)) &&
    (!isOverride(withdrawal) || isSamePatient(waste, withdrawal)) &&
    (!isOverride(withdrawal) || isSameMedicationProduct(waste, withdrawal))
  );
}

function getLastWaste(wastes) {
  const lastWasteIndex = wastes.length - 1;
  return wastes[lastWasteIndex];
}

function createWaste(wastes) {
  return {
    amount: getWasteAmount(wastes),
    units: lastWaste['Product.units'],
  };
}

function getWasteAmount(matchingWastes) {
  const INITIAL_WASTE_AMOUNT = 0;
  return matchingWastes.reduce(sumWasteAmount, INITIAL_WASTE_AMOUNT);
}

function sumWasteAmount(wasteSum, waste) {
  return wasteSum + waste.amount;
}

function getDisposition(withdrawal, waste) {
  return isWithdrawalWasted(withdrawal, waste)
    ? createDisposition(lastWaste, 'Waste')
    : getAdministration(withdrawal, waste);
}

function getAdministration(withdrawal, waste) {
  const administration = findAdministration(withdrawal, waste);
  if (isFound(administration)) {
    reconcileRecord(administration);
    return createDisposition(administration, 'Administration');
  }
  return getOtherTransaction(withdrawal);
}

function getOtherTransaction(withdrawal) {
  const otherTransaction = findOtherTransaction(withdrawal);
  if (isFound(otherTransaction)) {
    reconcileRecord(otherTransaction);
    return createDisposition(otherTransaction, otherTransaction.type);
  }
  return null;
}

function isWithdrawalWasted(withdrawal, waste) {
  if (!waste) return false;
  const totalWithdrawalStrength = getTotalWithdrawalStrength(withdrawal);
  return waste.amount >= totalWithdrawalStrength;
}

function isFound(record) {
  return !!record;
}

function findAdministration(withdrawal, waste) {
  const foundAdministration = _administrations.find(administration =>
    isMatchingAdministration(administration, withdrawal, waste)
  );
  return foundAdministration;
}

function isMatchingAdministration(administration, withdrawal, waste) {
  const MILLISECONDS_IN_FIVE_MINUTES = 300000; // Adjustment for Pyxis-Sunrise time desync.
  const administrationDate = convertDateToMilliseconds(administration.date);
  const withdrawalDate = convertDateToMilliseconds(withdrawal.date);
  const fiveMinutesBeforeWithdrawalDate =
    withdrawalDate - MILLISECONDS_IN_FIVE_MINUTES;
  const nextWithdrawalDate = hasNextWithdrawal()
    ? convertDateToMilliseconds(nextWithdrawal.date)
    : null;
  return (
    !isReconciled(administration) &&
    occurredAfterDate(administrationDate, fiveMinutesBeforeWithdrawalDate) &&
    (!hasNextWithdrawal() ||
      occurredBeforeDate(administrationDate, nextWithdrawalDate)) &&
    (!hasWaste(waste) ||
      isRemainingStrengthSameAsDose(withdrawal, waste, administration)) &&
    (isOverride(withdrawal) ||
      isSameMedicationOrder(administration, withdrawal)) &&
    (!isOverride(withdrawal) || isSamePatient(administration, withdrawal)) &&
    (!isOverride(withdrawal) || isSameMedication(administration, withdrawal))
  );
}

function findOtherTransaction(withdrawal) {
  const predicate = otherTransaction =>
    isOtherRelatedTransaction(otherTransaction, withdrawal);
  return _otherTransactions.find(predicate);
}

function isOtherRelatedTransaction(otherTransaction, withdrawal) {
  return (
    !isReconciled(otherTransaction) &&
    occurredConcurrentlyOrAfter(otherTransaction, withdrawal) &&
    (!hasNextWithdrawal() ||
      occurredBefore(otherTransaction, nextWithdrawal)) &&
    (isOverride(withdrawal) ||
      isSameMedicationOrder(otherTransaction, withdrawal)) &&
    (!isOverride(withdrawal) || isSamePatient(otherTransaction, withdrawal)) &&
    (!isOverride(withdrawal) ||
      isSameMedicationProduct(otherTransaction, withdrawal))
  );
}

function createDisposition(record, recordType) {
  return {
    medicationOrderId: record.medicationOrderId,
    providerName: record.providerName,
    date: record.date,
    type: recordType,
  };
}

function getPainReassessment(withdrawal, disposition) {
  const painReassessment = findPainReassessment(withdrawal, disposition);
  if (isFound(painReassessment)) {
    reconcileRecord(painReassessment);
    return createPainReassessment(painReassessment);
  }
  return null;
}

function isAdministration(disposition) {
  return disposition.type === 'Administration';
}

function findPainReassessment(withdrawal, administration) {
  return _painReassessments.find(painReassessment =>
    isMatchingPainReassessment(withdrawal, painReassessment, administration)
  );
}

function isMatchingPainReassessment(
  withdrawal,
  painReassessment,
  administration
) {
  const MILLISECONDS_PER_HOUR = 3600000; // One hour window for pain reassessment.
  const painReassessmentDate = convertDateToMilliseconds(painReassessment.date);
  const administrationDate = convertDateToMilliseconds(administration.date);
  const oneHourAfterAdministrationDate =
    administrationDate + MILLISECONDS_PER_HOUR;
  return (
    !isReconciled(painReassessment) &&
    occurredAfterDate(painReassessmentDate, administrationDate) &&
    occurredBeforeDate(painReassessmentDate, oneHourAfterAdministrationDate) &&
    (!hasNextWithdrawal() ||
      occurredBefore(painReassessment, nextWithdrawal)) &&
    (isOverride(withdrawal) ||
      isSameMedicationOrder(painReassessment, administration)) &&
    (!isOverride(withdrawal) ||
      isSamePatient(painReassessment, administration)) &&
    (!isOverride(withdrawal) ||
      isSameMedication(painReassessment, administration))
  );
}

function createPainReassessment({ providerName, date }) {
  return { providerName, date };
}

function convertDateToMilliseconds(date) {
  return new Date(date).getTime();
}

function isReconciled(record) {
  return reconciledRecords.has(record);
}

function occurredAfter({ date: date1 }, { date: date2 }) {
  return date1 > date2;
}

function occurredConcurrentlyOrAfter({ date: date1 }, { date: date2 }) {
  return date1 >= date2;
}

function occurredBefore({ date: date1 }, { date: date2 }) {
  return date1 < date2;
}

function occurredAfterDate(date1, date2) {
  return date1 > date2;
}

function occurredBeforeDate(date1, date2) {
  return date1 < date2;
}

function hasNextWithdrawal() {
  return !!nextWithdrawal;
}

function isOverride({ medicationOrderId }) {
  return medicationOrderId === 'OVERRIDE';
}

function isSameMedicationOrder(
  { medicationOrderId: id1 },
  { medicationOrderId: id2 }
) {
  return id1 === id2;
}

function isSamePatient(
  { medicalRecordNumber: mrn1 },
  { medicalRecordNumber: mrn2 }
) {
  return mrn1 === mrn2;
}

function isSameMedicationProduct(
  { medicationProductId: id1 },
  { medicationProductId: id2 }
) {
  return id1 === id2;
}

function isSameMedication(
  { 'medication.name': med1 },
  { 'medication.name': med2 }
) {
  return med1 === med2;
}

function hasWaste(waste) {
  return !!waste;
}

function isRemainingStrengthSameAsDose(withdrawal, waste, { dose }) {
  const remainingWithdrawalStrength = getRemainingWithdrawalStrength(
    withdrawal,
    waste
  );
  return remainingWithdrawalStrength === dose;
}

function getRemainingWithdrawalStrength(withdrawal, waste) {
  const totalWithdrawalStrength = getTotalWithdrawalStrength(withdrawal);
  return totalWithdrawalStrength - waste.amount;
}

function getTotalWithdrawalStrength({ strength, amount }) {
  return strength * amount;
}

function reconcileRecords(records) {
  records.forEach(reconcileRecord);
}

function reconcileRecord(record) {
  reconciledRecords.add(record);
}
