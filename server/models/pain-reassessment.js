const { model, Schema } = require('mongoose');

const painReassessmentSchema = new Schema({
  date: {
    required: [true, 'Pain reassessment must have a date.'],
    type: Date,
  },
  medicationOrder: {
    maxlength: [
      9,
      'Medication order ID may not be longer than 9 characters.',
    ],
    ref: 'medicationOrder',
    required: [true, 'Pain reassessment must have a medication order.'],
    type: String,
  },
  username: {
    ref: 'emarUsername',
    required: [true, 'Pain reassessment must have a username.'],
    type: Schema.Types.ObjectId,
  },
});

const PainReassessmentModel = model('PainReassessment', painReassessmentSchema);

module.exports = PainReassessmentModel;
