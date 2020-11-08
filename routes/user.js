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

router.put('/follow', requireLogin, (req, res) => {
    User.findOneAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    }, {
        new: true
    }, (err, result)=> {
        if(err){
            return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {
            new: true
        })
        .select('-password')
        .then(result=> res.json(result))
        .catch(err=>{
            return res.status(422).json({ error: err })
        })
    })
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findOneAndUpdate(req.body.followId, {
        $pull: {followers: req.user._id}
    }, {
        new: true
    }, (err, result)=> {
        if(err){
            return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.followId}
        }, {
            new: true
        })
        .then(result=> res.json(result))
        .catch(err=>{
            return res.status(422).json({ error: err })
        })
    })
});

router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate( req.user._id, {$set:{pic: req.body.pic}},{new:true},
        (err, result)=> {
            if(err){
                return res.status(422).json({ error: err })
            }
            res.json(result)
        })
});

router.post('/search-users', async (req, res) => {
    try {
        const userPattern = new RegExp('^'+ req.body.query);
        const user = await User.find({email: {$regex: userPattern}});
        res.json({user});
    } catch (err) {
        console.log(err);
    }
});
 
 
module.exports = router;
