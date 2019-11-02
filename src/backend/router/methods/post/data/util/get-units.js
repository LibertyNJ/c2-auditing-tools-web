module.exports = getUnits;

function getUnits(unitsString) {
  if (/milligram|cup|oral syrng/i.test(unitsString)) {
    return 'mG';
  }
  if (/microgram/i.test(unitsString)) {
    return /kg\/hr/i.test(unitsString) ? 'mCg/kG/Hr' : 'mCg';
  }
  if (/mg\/hr/i.test(unitsString)) {
    return 'mG/Hr';
  }
  if (/tablet/i.test(unitsString)) {
    return 'tablet';
  }
  if (/patch/i.test(unitsString)) {
    return 'patch';
  }
  return null;
}
