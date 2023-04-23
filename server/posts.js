const express = require('express');
const router = express.Router();
const Post = require('./postModel.js');

router.get('/', async (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

router.post('/', async (req, res) => {
  const { title, body, image } = req.body;
  const newPost = new Post({
    title,
    body,
    image
  });
  newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

router.delete('/', async (req, res) => {
  Post.deleteMany()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

module.exports = router;