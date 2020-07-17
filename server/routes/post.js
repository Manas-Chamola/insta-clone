const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = mongoose.model('Post');
const requireLogin = require('../middleware/requireLogin');

router.get('/allpost', async (req, res) => {
  try {
    const posts = await Post.find().populate('postedBy', '_id name');
    res.json({ posts });
  } catch (err) {
    console.log('Error fetching posts');
  }
});

router.get('/mypost', requireLogin, async (req, res) => {
  try {
    const myPost = await Post.find({ postedBy: req.user._id }).populate(
      'postedBy',
      '_id name'
    );
    res.json({ myPost });
  } catch (err) {
    console.log('Error fetching My posts');
  }
});

router.post('/createpost', requireLogin, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(422).send({ error: 'Please add all the fields' });
    }

    req.user.password = undefined;
    const post = new Post({
      title,
      body,
      postedBy: req.user,
    });

    const response = await post.save();
    res.json({ post: response });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
