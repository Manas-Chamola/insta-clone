const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: 'https://res.cloudinary.com/manas123/image/upload/v1595078140/soowxocwz1s3ui9nzaqz.jpg',
  },
  followers: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

});

mongoose.model('User', userSchema);
