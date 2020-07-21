const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { JWT_Secret } = require('../config/keys');
const User = mongoose.model('User');

//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

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
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
      pic
    });

    const registeredUser=await user.save();

    transporter.sendMail({
      to: registeredUser.email,
      from:'chamolamanas19@gmail.com',
      subject: 'Signup successful',
      html:'<h1>Welcome to Instagram!!!</h1>'
    });

    res.json({
      message: 'Successful signup',
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/signin', async (req, res) => {
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
      const { _id, name, email, followers, following, pic } = savedUser;
      res.json({
        token,
        user: {
          _id,
          name,
          email,
          followers, 
          following,
          pic
        },
      });
    } else {
      return res.status(422).json({ error: 'Password invalid' });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, async(err,buffer)=> {
    if(err){
      console.log(err);
    }
    const token = buffer.toString('hex');
    const user = await User.findOne({email: req.body.email});
    if(!user){
      return res.status(422).json({ error: 'User doesnt exist' });
    }
    user.resetToken = token;
    user.expireToken = Date.now() + 60 * 60 * 1000;
    await user.save();
    transporter.sendMail({
      to: user.email,
      from:'chamolamanas19@gmail.com',
      subject: 'Password reset',
      html:`<p>You requested for password reset!!!</p>
            <h5>Click on this <a href="http://localhost:3000/reset/${token}"> link </a> to reset password</h5>`
    });
    res.json({message: 'Check your email'});
  })
});

router.post('/new-password', async (req, res) => {
try{

  const newPassword = req.body.password;
  const sentToken = req.body.token;
  const user = await User.findOne({
    resetToken: sentToken,
    expireToken:{$gt: Date.now()}
  });

  if(!user){
    return res.status(422).json({ error: 'Try again! session expired' });
  }

 const hashedPassword = await bcrypt.hash(newPassword,12);
 user.password = hashedPassword;
 user.resetToken = undefined;
 user.expireToken = undefined;
  await user.save();
 res.json({message: 'Password update success'});
}
catch(err){
  console.log(err);
}

});

module.exports = router;
