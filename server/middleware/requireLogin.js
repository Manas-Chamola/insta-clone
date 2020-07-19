const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_Secret } = require('../config/keys');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in' });
  }

  const token = authorization.replace('Bearer', '');
  jwt.verify(token, JWT_Secret, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'You must be logged in' });
    }

    const { _id } = payload;
    const userData = await User.findById(_id);
    req.user = userData;
    next();
  });
};
