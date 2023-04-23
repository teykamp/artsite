const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: false 
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true
  },
  image: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Post', postSchema);