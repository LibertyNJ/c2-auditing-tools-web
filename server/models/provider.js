const { model, Schema } = require('mongoose');

const providerSchema = new Schema({
  name: {
    first: {
      required: [true, 'Provider must have a first name.'],
      trim: true,
      type: String,
    },
    last: {
      required: [true, 'Provider must have a last name.'],
      trim: true,
      type: String,
    },
    middleInitial: {
      maxlength: [1, 'Provider middle initial must be a single character.'],
      trim: true,
      type: String,
      uppercase: true,
    },
  },
  usernames: {
    adc: [{ ref: 'adcUsername', type: Schema.Types.ObjectId }],
    emar: [{ ref: 'emarUsername', type: Schema.Types.ObjectId }],
  },
});

providerSchema.virtual('fullName').get(fullNameGetter);

function fullNameGetter() {
  let fullName = `${this.name.last}, ${this.name.first}`;

  if (this.name.middleInitial) {
    fullName += ` ${this.name.middleInitial}`;
  }

  return fullName;
}

const ProviderModel = model('Provider', providerSchema);

module.exports = ProviderModel;
