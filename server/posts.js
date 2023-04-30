const express = require('express');
const router = express.Router();
const Post = require('./postModel.js');
const Tag = require('./tagModel.js');

router.get('/', async (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

router.post('/', async (req, res) => {
  const newPost = new Post({ ...req.body });
  newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

router.delete('/:id', async (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

router.delete('/', async (req, res) => {
  Post.deleteMany()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

// Tags
router.post('/tag', async (req, res) => {
  const newTag = new Tag({ ...req.body });
  newTag.save()
    .then(tag => res.json(tag))
    .catch(err => res.status(404).json(err));
});

router.delete('/tag/:id', async (req, res) => {
  Tag.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

module.exports = router;