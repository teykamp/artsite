const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  parentId: {
    // the id of the post/comment it is referencing
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