const { model, Schema } = require('mongoose');

const adcUsernameSchema = new Schema({
  username: {
    required: [true, 'ADC username must have a username.'],
    type: String,
  },
});

const AdcUsernameModel = model('AdcUsername', adcUsernameSchema);

module.exports = AdcUsernameModel;
