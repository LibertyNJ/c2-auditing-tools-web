'use-strict';

const reconciledRecords = new WeakSet();

let administrations = [];
let otherTransactions = [];
let painReassessments = [];
let wastes = [];
let withdrawals = [];

let lastWaste;
let nextWithdrawal;

module.exports = function getLedger({ selectedWithdrawals, ...records }) {
  setRecords(records);
  return selectedWithdrawals.map(createLedgerRecord);
};

function setRecords(records) {
  administrations = [...records.administrations];
  otherTransactions = [...records.otherTransactions];
  painReassessments = [...records.painReassessments];
  wastes = [...records.wastes];
  withdrawals = [...records.withdrawals];
}

function createLedgerRecord(withdrawal) {
  setNextWithdrawal(withdrawal);

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

function setNextWithdrawal(withdrawal) {
  nextWithdrawal = findNextWithdrawal(withdrawal);
}

function findNextWithdrawal(currentWithdrawal) {
  return withdrawals.find(withdrawal => isNextWithdrawal(withdrawal, currentWithdrawal));
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
  const matchingWastes = findMatchingWastes(withdrawal);
  reconcileRecords(matchingWastes);
  setLastWaste(matchingWastes);

  if (lastWaste) {
    return {
      amount: getWasteAmount(matchingWastes),
      units: lastWaste.units,
    };
  }

  return null;
}

function findMatchingWastes(withdrawal) {
  return wastes.filter(waste => isMatchingWaste(waste, withdrawal));
}

function isMatchingWaste(waste, withdrawal) {
  return (
    !isReconciled(waste)
    && occurredConcurrentlyOrAfter(waste, withdrawal)
    && (!hasNextWithdrawal() || occurredBefore(waste, nextWithdrawal))
    && (isOverride(withdrawal) || isSameMedicationOrder(waste, withdrawal))
    && (!isOverride(withdrawal) || isSamePatient(waste, withdrawal))
    && (!isOverride(withdrawal) || isSameMedicationProduct(waste, withdrawal))
  );
}

function setLastWaste(matchingWastes) {
  lastWaste = findLastWaste(matchingWastes);
}

function findLastWaste(matchingWastes) {
  return matchingWastes[matchingWastes.length - 1];
}

function getWasteAmount(matchingWastes) {
  const INITIAL_WASTE_AMOUNT = 0;
  return matchingWastes.reduce(sumWasteAmount, INITIAL_WASTE_AMOUNT);
}

function sumWasteAmount(sum, { amount }) {
  return sum + amount;
}

function getDisposition(withdrawal, waste) {
  if (isWithdrawalWasted(withdrawal, waste)) {
    return createDisposition(lastWaste, 'Waste');
  }

  return getAdministration(withdrawal, waste);
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
  if (!waste) {
    return false;
  }

  const totalWithdrawnStrength = calculateTotalWithdrawnStrength(withdrawal);
  return waste.amount >= totalWithdrawnStrength;
}

function isFound(record) {
  return !!record;
}

function findAdministration(withdrawal, waste) {
  return administrations.find(administration => isMatchingAdministration(administration, withdrawal, waste));
}

function isMatchingAdministration(administration, withdrawal, waste) {
  const MILLISECONDS_IN_FIVE_MINUTES = 300000; // Adjustment for Pyxis-Sunrise clock desync.

  const administrationTimestamp = convertTimestampToMilliseconds(administration.timestamp);
  const withdrawalTimestamp = convertTimestampToMilliseconds(withdrawal.timestamp);

  return (
    !isReconciled(administration)
    && occurredAfterTimestamp(
      administrationTimestamp,
      withdrawalTimestamp - MILLISECONDS_IN_FIVE_MINUTES,
    )
    && (!hasNextWithdrawal() || occurredBeforeTimestamp(administration, nextWithdrawal))
    && (!hasWaste(waste) || isRemainingStrengthSameAsDose(withdrawal, waste, administration))
    && (isOverride(withdrawal) || isSameMedicationOrder(administration, withdrawal))
    && (!isOverride(withdrawal) || isSamePatient(administration, withdrawal))
    && (!isOverride(withdrawal) || isSameMedication(administration, withdrawal))
  );
}

function findOtherTransaction(withdrawal) {
  const predicate = otherTransaction => isMatchingOtherTransaction(otherTransaction, withdrawal);
  return otherTransactions.find(predicate);
}

function isMatchingOtherTransaction(otherTransaction, withdrawal) {
  return (
    !isReconciled(otherTransaction)
    && occurredConcurrentlyOrAfter(otherTransaction, withdrawal)
    && (!hasNextWithdrawal() || occurredBefore(otherTransaction, nextWithdrawal))
    && (isOverride(withdrawal) || isSameMedicationOrder(otherTransaction, withdrawal))
    && (!isOverride(withdrawal) || isSamePatient(otherTransaction, withdrawal))
    && (!isOverride(withdrawal) || isSameMedicationProduct(otherTransaction, withdrawal))
  );
}

function createDisposition({ provider, timestamp }, type) {
  return { provider, timestamp, type };
}

function getPainReassessment(withdrawal, disposition) {
  const painReassessement = findPainReassessment(withdrawal, disposition);

  if (isFound(painReassessement)) {
    reconcileRecord(painReassessement);
    return createPainReassessment(painReassessement);
  }

  return null;
}

function isAdministration({ type }) {
  return type === 'Administration';
}

function findPainReassessment(withdrawal, administration) {
  return painReassessments.find(painReassessment => isMatchingPainReassessment(withdrawal, painReassessment, administration));
}

function isMatchingPainReassessment(withdrawal, painReassessment, administration) {
  const MILLISECONDS_PER_HOUR = 3600000; // One hour window for pain reassessment.

  const painReassessmentTimestamp = convertTimestampToMilliseconds(painReassessment.timestamp);
  const administrationTimestamp = convertTimestampToMilliseconds(administration.timestamp);

  return (
    !isReconciled(painReassessment)
    && occurredAfterTimestamp(painReassessmentTimestamp, administrationTimestamp)
    && occurredBeforeTimestamp(
      painReassessmentTimestamp,
      administrationTimestamp + MILLISECONDS_PER_HOUR,
    )
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
  const remainingStrength = calculateRemainingStrength(withdrawal, waste);
  return remainingStrength === dose;
}

function calculateRemainingStrength(withdrawal, waste) {
  const totalStrength = calculateTotalWithdrawnStrength(withdrawal);
  return totalStrength - waste.amount;
}

function calculateTotalWithdrawnStrength({ strength, amount }) {
  return strength * amount;
}

function reconcileRecords(records) {
  records.forEach(reconcileRecord);
}

function reconcileRecord(record) {
  reconciledRecords.add(record);
}
