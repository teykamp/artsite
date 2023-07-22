const express = require('express');
const router = express.Router();
const Post = require('./postModel.js');
const Tag = require('./tagModel.js');
const Comment = require('./commentModel.js');

// const app = express();
// app.use(express.json());


router.get('/posts', async (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

// router.get('/post/:id')

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

router.delete('/posts/:id', async (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err));
});

router.delete('/posts', async (req, res) => {
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
router.get('posts/likes/increment/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: {'interactions.likes': 1 }})
  res.json('likes incremented on post' + req.params.id)
})

router.get('posts/likes/decrement/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.likes': -1 } })
  res.json('likes decremented on post' + req.params.id)
})

router.get('posts/dislikes/increment/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.dislikes': 1 } })
  res.json('dislikes incremented on post' + req.params.id)
})

router.get('posts/dislikes/decrement/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { 'interactions.dislikes': -1 } })
  res.json('dislikes decremented on post' + req.params.id)
})

router.post('comments/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $push: { 'interactions.comments': { $each: [req.body], $position: 0 } } }) 
  res.json('added comment to post' + req.params.id)
})


/*

// Comments
router.get('/comments/:id', async (req, res) => {
  Comment.findOne(req.params.id)
    .then(comments => res.json(comments))
    .catch(err => res.status(404).json(err));
});

// called when post created
router.post('/comments', async (req, res) => {
  const newComment = new Comment({ ...req.body });
  newComment.save()
    .then(comment => res.json(comment))
    .catch(err => res.status(404).json(err));
});

// called when comment posted
router.post('/comments/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $push: { 'comments': { $each: [req.body], $position: 0 } } })
  res.json('added comment to post' + req.params.id)
})

*/

module.exports = router;
