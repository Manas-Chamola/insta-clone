const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = mongoose.model('Post');
const requireLogin = require('../middleware/requireLogin');

router.get('/allpost', requireLogin, async (req, res) => {
  try {
    const posts = await Post.find().populate('postedBy', '_id name').populate('comments.postedBy','_id name');
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
    )
    .populate('comments.postedBy','_id name');
    res.json({ myPost });
  } catch (err) {
    console.log('Error fetching My posts');
  }
});
 
router.post('/createpost', requireLogin, async (req, res) => {
  try {
    const { title, body, pic } = req.body;

    if (!title || !body || !pic) {
      return res.status(422).send({ error: 'Please add all the fields' });
    }
 
    req.user.password = undefined;
    const post = new Post({
      title,
      body,
      photo: pic,
      postedBy: req.user,
    });

    const response = await post.save();
    res.json({ post: response });
  } catch (err) {
    console.log(err);
  }
});

router.put('/like', requireLogin, async (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
  .populate('comments.postedBy','_id name')
  .populate('postedBy','_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put('/unlike', requireLogin, async (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
  .populate('comments.postedBy','_id name')
  .populate('postedBy','_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put('/comment', requireLogin, async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  }
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment},
    },
    {
      new: true,
    }
  )
  .populate('comments.postedBy','_id name')
  .populate('postedBy','_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
  Post.findOne({_id: req.params.postId})
  .populate('postedBy','_id')
  .exec((err,post) => {
    if(err || !post) {
      return res.status(422).json({ error: err });
    }
    if(post.postedBy._id.toString()===req.user._id.toString()){
      post.remove()
      .then(result=> {
        res.json(result)
      })
      .catch(err=> console.log(err))
    }
  })
})

module.exports = router;
