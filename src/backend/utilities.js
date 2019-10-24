module.exports = {
  createResponse,
  getForm,
  getMedicationName,
  getUnits,
  handleError,
  isArray,
  isNull,
};

function getForm(formString) {
  if (/tablet/i.test(formString)) {
    if (/[^a-zA-Z]ER[^a-zA-Z]/.test(formString)) {
      return 'ER Tablet';
    }

    return 'Tablet';
  }

  if (/[^a-zA-Z]ir[^a-zA-Z]|oxycodone.*acetaminophen/i.test(formString)) {
    return 'Tablet';
  }

  if (/capsule/i.test(formString)) {
    return 'Capsule';
  }

  if (/cup|syrup|solution|liquid/i.test(formString)) {
    return 'Cup';
  }

  if (/vial/i.test(formString)) {
    return 'Vial';
  }

  if (/injectable/i.test(formString)) {
    return 'Injectable';
  }

  if (/ampule/i.test(formString)) {
    return 'Ampule';
  }

  if (/patch/i.test(formString)) {
    return 'Patch';
  }

  if (/bag|infusion|ivbp/i.test(formString)) {
    return 'Bag';
  }

  if (/syringe|tubex|pca/i.test(formString)) {
    return 'Syringe';
  }

  if (/concentrate/i.test(formString)) {
    return 'Concentrate';
  }

  throw new Error(`Invalid form string: ${formString}`);
}

function getMedicationName(medicationProductAdcName) {
  if (/oxycodone/i.test(medicationProductAdcName)) {
    if (/acetaminophen/i.test(medicationProductAdcName)) {
      return 'Oxycodone–Acetaminophen';
    }

    return 'Oxycodone';
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

  throw new Error(`Invalid medication product ADC name: ${medicationProductAdcName}`);
}

function getUnits(unitsString) {
  if (/milligram|cup/i.test(unitsString)) {
    return 'mG';
  }

  if (/microgram/i.test(unitsString)) {
    if (/kg\/hr/i.test(unitsString)) {
      return 'mCg/kG/Hr';
    }

    return 'mCg';
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

  throw new Error(`Invalid units string: ${unitsString}`);
}

function handleError(error) {
  throw error;
}

function isArray(value) {
  return Array.isArray(value);
}

function isNull(value) {
  return value === null;
}

function createResponse(type, status, body) {
  return {
    body,
    head: {
      status,
      type,
    },
  };
}
