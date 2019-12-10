const { model, Schema } = require('mongoose');

const emarUsernameSchema = new Schema({
  username: {
    required: [true, 'eMAR username must have a username.'],
    type: String,
  },
});

const EmarUsernameModel = model('EmarUsername', emarUsernameSchema);

module.exports = EmarUsernameModel;
