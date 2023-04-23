const express = require('express');
const router = express.Router();
const Post = require('./postModel.js');

router.get('/', async (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

router.post('/', async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    body: req.body.body,
    image: req.body.image
  });
  newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

module.exports = router;