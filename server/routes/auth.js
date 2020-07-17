const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_Secret } = require('../keys');
const User = mongoose.model('User');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(422).json({ error: 'Please add all the fields' });
    }
    const savedUser = await User.findOne({ email: email });
    if (savedUser) {
      return res.status(422).json({ error: 'User already exists ' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    res.json({
      message: 'Successful signup',
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/sigin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .json({ error: 'Please add all the email/password' });
    }
    const savedUser = await User.findOne({ email });
    if (!savedUser) {
      return res.status(422).json({ error: 'User or password invalid' });
    }
    const doMatch = await bcrypt.compare(password, savedUser.password);
    if (doMatch) {
      const token = jwt.sign({ _id: savedUser._id }, JWT_Secret);
      res.json({ token });
    } else {
      return res.status(422).json({ error: 'Password invalid' });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
