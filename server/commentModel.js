const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  postId: {
    type: String,
    required: true
  },
  body: { 
    type: String,
    required: false,
    default: ''
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Comment', commentSchema);