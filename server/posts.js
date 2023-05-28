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
  console.log('posting')
  const newPost = new Post({ ...req.body });
  newPost.save()
    .then(post => res.json(post))
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    });
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
router.get('/tags', async (req, res) => {
  Tag.find()
    .then(tags => res.json(tags))
    .catch(err => res.status(404).json(err));
});

router.post('/tags', async (req, res) => {
  const newTag = new Tag({ ...req.body });
  newTag.save()
    .then(tag => res.json(tag))
    .catch(err => res.status(404).json(err));
});

router.delete('/tags/:id', async (req, res) => {
  Tag.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

// Interactions
router.get('/likes/increment/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: {'interactions.likes': 1 }})
  res.json('likes incremented on post' + req.params.id)
})

router.get('/likes/decrement/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.likes': -1 } })
  res.json('likes decremented on post' + req.params.id)
})

router.get('/dislikes/increment/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.dislikes': 1 } })
  res.json('dislikes incremented on post' + req.params.id)
})

router.get('/dislikes/decrement/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.dislikes': -1 } })
  res.json('dislikes decremented on post' + req.params.id)
})


module.exports = router;