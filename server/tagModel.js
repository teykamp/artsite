const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#000000',
    required: true
  }
});

module.exports = mongoose.model('Tag', tagSchema);