const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const requireLogin = require('../middleware/requireLogin');

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name')
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});
 
module.exports = router;
