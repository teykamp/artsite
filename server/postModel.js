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
  images: {
    type: Array,
    required: false
  },
  tagData: {
    type: Array,
    required: false
  },
  interactions: {
    type: {
      likes: {
        type: Number,
      },
      dislikes: {
        type: Number,
      },
      comments: Array,
    },
    default: {
      likes: 0,
      dislikes: 0,
      comments: [],
    }
  },
});

module.exports = mongoose.model('Post', postSchema);