module.exports = getMedicationName;

function getMedicationName(medicationProductAdcName) {
  if (/oxycodone/i.test(medicationProductAdcName)) {
    return /acetaminophen/i.test(medicationProductAdcName)
      ? 'Oxycodone–Acetaminophen'
      : 'Oxycodone';
  }
  if (/hydromorphone/i.test(medicationProductAdcName)) {
    return 'Hydromorphone';
  }
  if (/morphine/i.test(medicationProductAdcName)) {
    return 'Morphine';
  }
  if (/fentanyl/i.test(medicationProductAdcName)) {
    return 'Fentanyl';
  }
  if (/hydrocodone/i.test(medicationProductAdcName) && /homatrop/i.test(medicationProductAdcName)) {
    return 'Hydrocodone–Homatropine';
  }
  return null;
}
