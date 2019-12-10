const { model, Schema } = require('mongoose');

const medicationOrderSchema = new Schema({
  _id: {
    maxlength: [
      9,
      'Medication order ID may not be longer than 9 characters.',
    ],
    required: [true, 'Medication order must have an ID.'],
    type: String,
  },
  dose: {
    type: Number,
  },
  form: {
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
    trim: true,
    type: String,
  },
  units: {
    trim: true,
    type: String,
  },
});

const MedicationOrderModel = model('MedicationOrder', medicationOrderSchema);

module.exports = MedicationOrderModel;
