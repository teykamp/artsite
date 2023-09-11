const express = require('express');
const router = express.Router();
const Post = require('./postModel.js');
const Tag = require('./tagModel.js');
const Comment = require('./commentModel.js');

// get all posts
router.get('/posts', async (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

// get one post
router.get('/post/:id', async (req, res) => {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => res.status(404).json(err));
})

// delete one post
router.delete('/post/:id', async (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

// new post
router.post('/posts', async (req, res) => {
  console.log('posting') 
  const newPost = new Post({ ...req.body });
  newPost.save()
    .then(post => res.json(post))
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    });
});

// delete all posts
router.delete('/posts', async (req, res) => {
  Post.deleteMany()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

// edit post
router.post('/post/:id/edit', async (req, res) => {
  console.log('edited post')
  Post.findByIdAndUpdate(req.params.id, { ...req.body })
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

// get all tags
router.get('/tags', async (req, res) => {
  Tag.find()
    .then(tags => res.json(tags))
    .catch(err => res.status(404).json(err));
});

// new tag
router.post('/tags', async (req, res) => {
  const newTag = new Tag({ ...req.body });
  newTag.save()
    .then(tag => res.json(tag))
    .catch(err => res.status(404).json(err));
});

// delete tag
router.delete('/tag/:id', async (req, res) => {
  Tag.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

// Interactions
router.get('/post/:id/likes/increment', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: {'interactions.likes': 1 }})
  res.json('likes incremented on post' + req.params.id)
})

router.get('/post/:id/likes/decrement', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.likes': -1 } })
  res.json('likes decremented on post' + req.params.id)
})

router.get('/post/:id/dislikes/increment', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.dislikes': 1 } })
  res.json('dislikes incremented on post' + req.params.id)
})

router.get('/post/:id/dislikes/decrement', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.dislikes': -1 } })
  res.json('dislikes decremented on post' + req.params.id)
})

// get comments on one post
router.get('/comments/:parentId', async (req, res) => {
  Comment.find({ parentId: req.params.parentId })
    .then(comments => res.json(comments))
    .catch(err => res.status(404).json(err));
});

// get all comments
router.get('/comments', async (req, res) => {
  Comment.find()
    .then(comments => res.json(comments))
    .catch(err => res.status(404).json(err));
});

// create new comment
router.post('/comments/', async (req, res) => {
  const newComment = new Comment({ ...req.body });
  newComment.save()
    .then(comment => res.json(comment))
    .catch(err => res.status(404).json(err));
});

// delete comments associated to post 
router.delete('/comments/:parentId', async (req, res) => {
  Comment.deleteMany({ parentId: req.params.parentId })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

// delete all comments
router.delete('/comments', async (req, res) => {
  Comment.deleteMany()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

module.exports = router;
