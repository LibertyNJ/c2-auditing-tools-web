const { model, Schema } = require('mongoose');

const medicationProductSchema = new Schema({
  adcDescription: {
    required: [true, 'Medication product must have an ADC description.'],
    trim: true,
    type: String,
  },
  form: {
    required: [true, 'Medication product must a form.'],
    trim: true,
    type: String,
  },
  medication: {
    enum: [
      'Fentanyl',
      'Hydrocodone–Homatropine',
      'Hydromorphone',
      'Morphine',
      'Oxycodone',
      'Oxycodone–Acetaminophen',
    ],
    required: [true, 'Medication order must have a medication.'],
    trim: true,
    type: String,
  },
  strength: {
    required: [true, 'Medication product must have a strength.'],
    type: Number,
  },
  units: {
    required: [true, 'Medication product must have units.'],
    trim: true,
    type: String,
  },
});

const MedicationProductModel = model(
  'MedicationProduct',
  medicationProductSchema
);

module.exports = MedicationProductModel;
