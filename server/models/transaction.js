const { model, Schema } = require('mongoose');

const transactionSchema = new Schema({
  amount: {
    required: [true, 'Transaction must have an amount.'],
    type: Number,
  },
  date: {
    required: [true, 'Transaction must have a date.'],
    type: Date,
  },
  medicalRecordNumber: {
    type: String,
    maxlength: [
      8,
      'Medical record numbers may not be longer than 8 characters.',
    ],
  },
  medicationOrder: {
    maxlength: [
      9,
      'Medication order ID may not be longer than 9 characters.',
    ],
    ref: 'medicationOrder',
    type: String,
  },
  medicationProduct: {
    ref: 'medicationProduct',
    type: Schema.Types.ObjectId,
  },
  type: {
    enum: ['Restock', 'Return', 'Waste', 'Withdrawal'],
    required: [true, 'Transaction must have a type.'],
    type: String,
  },
  username: {
    ref: 'adcUsername',
    required: [true, 'Transaction must have a username.'],
    type: Schema.Types.ObjectId,
  },
});

const TransactionModel = model('Transaction', transactionSchema);

module.exports = TransactionModel;
