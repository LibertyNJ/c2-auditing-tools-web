const { model, Schema } = require('mongoose');

const administrationSchema = new Schema({
  date: {
    required: [true, 'Administration must have a date.'],
    type: Date,
  },
  medicationOrder: {
    maxlength: [
      9,
      'Medication order ID may not be longer than 9 characters.',
    ],
    ref: 'medicationOrder',
    required: [true, 'Administration must have a medication order.'],
    type: String,
  },
  username: {
    ref: 'emarUsername',
    required: [true, 'Administration must have a username.'],
    type: Schema.Types.ObjectId,
  },
});

const AdministrationModel = model('Administration', administrationSchema);

module.exports = AdministrationModel;
