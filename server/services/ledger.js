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
  const painReassessment = !!disposition && isAdministration(disposition)
    ? getPainReassessment(withdrawal, disposition)
    : null;
  return {
    dispositionProvider: disposition ? disposition.provider : null,
    dispositionTimestamp: disposition ? disposition.timestamp : null,
    dispositionType: disposition ? disposition.type : null,
    painReassessmentProvider: painReassessment ? painReassessment.provider : null,
    painReassessmentTimestamp: painReassessment ? painReassessment.timestamp : null,
    waste: waste ? `${waste.amount} ${waste.units}` : null,
    ...withdrawal,
  };
}

function getNextWithdrawal(currentWithdrawal) {
  return _withdrawals.find(withdrawal => isNextWithdrawal(withdrawal, currentWithdrawal));
}

function isNextWithdrawal(withdrawal, currentWithdrawal) {
  return (
    occurredAfter(withdrawal, currentWithdrawal)
    && (isOverride(currentWithdrawal) || isSameMedicationOrder(withdrawal, currentWithdrawal))
    && (!isOverride(currentWithdrawal) || isSamePatient(withdrawal, currentWithdrawal))
    && (!isOverride(currentWithdrawal) || isSameMedicationProduct(withdrawal, currentWithdrawal))
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
    !isReconciled(waste)
    && occurredConcurrentlyOrAfter(waste, withdrawal)
    && (!hasNextWithdrawal() || occurredBefore(waste, nextWithdrawal))
    && (isOverride(withdrawal) || isSameMedicationOrder(waste, withdrawal))
    && (!isOverride(withdrawal) || isSamePatient(waste, withdrawal))
    && (!isOverride(withdrawal) || isSameMedicationProduct(waste, withdrawal))
  );
}

function getLastWaste(wastes) {
  const lastWasteIndex = wastes.length - 1;
  return wastes[lastWasteIndex];
}

function createWaste(wastes) {
  return {
    amount: getWasteAmount(wastes),
    units: lastWaste.units,
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
  const foundAdministration = _administrations.find(administration => isMatchingAdministration(administration, withdrawal, waste));
  return foundAdministration;
}

function isMatchingAdministration(administration, withdrawal, waste) {
  const MILLISECONDS_IN_FIVE_MINUTES = 300000; // Adjustment for Pyxis-Sunrise time desync.
  const administrationTimestamp = convertTimestampToMilliseconds(administration.timestamp);
  const withdrawalTimestamp = convertTimestampToMilliseconds(withdrawal.timestamp);
  const fiveMinutesBeforeWithdrawalTimestamp = withdrawalTimestamp - MILLISECONDS_IN_FIVE_MINUTES;
  const nextWithdrawalTimestamp = hasNextWithdrawal()
    ? convertTimestampToMilliseconds(nextWithdrawal.timestamp)
    : null;
  return (
    !isReconciled(administration)
    && occurredAfterTimestamp(administrationTimestamp, fiveMinutesBeforeWithdrawalTimestamp)
    && (!hasNextWithdrawal()
      || occurredBeforeTimestamp(administrationTimestamp, nextWithdrawalTimestamp))
    && (!hasWaste(waste) || isRemainingStrengthSameAsDose(withdrawal, waste, administration))
    && (isOverride(withdrawal) || isSameMedicationOrder(administration, withdrawal))
    && (!isOverride(withdrawal) || isSamePatient(administration, withdrawal))
    && (!isOverride(withdrawal) || isSameMedication(administration, withdrawal))
  );
}

function findOtherTransaction(withdrawal) {
  const predicate = otherTransaction => isOtherRelatedTransaction(otherTransaction, withdrawal);
  return _otherTransactions.find(predicate);
}

function isOtherRelatedTransaction(otherTransaction, withdrawal) {
  return (
    !isReconciled(otherTransaction)
    && occurredConcurrentlyOrAfter(otherTransaction, withdrawal)
    && (!hasNextWithdrawal() || occurredBefore(otherTransaction, nextWithdrawal))
    && (isOverride(withdrawal) || isSameMedicationOrder(otherTransaction, withdrawal))
    && (!isOverride(withdrawal) || isSamePatient(otherTransaction, withdrawal))
    && (!isOverride(withdrawal) || isSameMedicationProduct(otherTransaction, withdrawal))
  );
}

function createDisposition(record, recordType) {
  return {
    medicationOrderId: record.medicationOrderId,
    provider: record.provider,
    timestamp: record.timestamp,
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
  return _painReassessments.find(painReassessment => isMatchingPainReassessment(withdrawal, painReassessment, administration));
}

function isMatchingPainReassessment(withdrawal, painReassessment, administration) {
  const MILLISECONDS_PER_HOUR = 3600000; // One hour window for pain reassessment.
  const painReassessmentTimestamp = convertTimestampToMilliseconds(painReassessment.timestamp);
  const administrationTimestamp = convertTimestampToMilliseconds(administration.timestamp);
  const oneHourAfterAdministrationTimestamp = administrationTimestamp + MILLISECONDS_PER_HOUR;
  return (
    !isReconciled(painReassessment)
    && occurredAfterTimestamp(painReassessmentTimestamp, administrationTimestamp)
    && occurredBeforeTimestamp(painReassessmentTimestamp, oneHourAfterAdministrationTimestamp)
    && (!hasNextWithdrawal() || occurredBefore(painReassessment, nextWithdrawal))
    && (isOverride(withdrawal) || isSameMedicationOrder(painReassessment, administration))
    && (!isOverride(withdrawal) || isSamePatient(painReassessment, administration))
    && (!isOverride(withdrawal) || isSameMedication(painReassessment, administration))
  );
}

function createPainReassessment({ provider, timestamp }) {
  return { provider, timestamp };
}

function convertTimestampToMilliseconds(timestamp) {
  return new Date(timestamp).getTime();
}

function isReconciled(record) {
  return reconciledRecords.has(record);
}

function occurredAfter({ timestamp: time1 }, { timestamp: time2 }) {
  return time1 > time2;
}

function occurredConcurrentlyOrAfter({ timestamp: time1 }, { timestamp: time2 }) {
  return time1 >= time2;
}

function occurredBefore({ timestamp: time1 }, { timestamp: time2 }) {
  return time1 < time2;
}

function occurredAfterTimestamp(timestamp1, timestamp2) {
  return timestamp1 > timestamp2;
}

function occurredBeforeTimestamp(timestamp1, timestamp2) {
  return timestamp1 < timestamp2;
}

function hasNextWithdrawal() {
  return !!nextWithdrawal;
}

function isOverride({ medicationOrderId }) {
  return medicationOrderId === 'OVERRIDE';
}

function isSameMedicationOrder({ medicationOrderId: id1 }, { medicationOrderId: id2 }) {
  return id1 === id2;
}

function isSamePatient({ medicalRecordNumber: mrn1 }, { medicalRecordNumber: mrn2 }) {
  return mrn1 === mrn2;
}

function isSameMedicationProduct({ medicationProductId: id1 }, { medicationProductId: id2 }) {
  return id1 === id2;
}

function isSameMedication({ medication: med1 }, { medication: med2 }) {
  return med1 === med2;
}

function hasWaste(waste) {
  return !!waste;
}

function isRemainingStrengthSameAsDose(withdrawal, waste, { dose }) {
  const remainingWithdrawalStrength = getRemainingWithdrawalStrength(withdrawal, waste);
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
