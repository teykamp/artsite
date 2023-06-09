const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  postId: {
    type: String,
    required: true
  },
  comments: { // array created when new post created. array pushed when comment posted
    type: Array, // each comment has a date and a body
    required: false,
    default: []
  }
});

module.exports = mongoose.model('Comment', commentSchema);