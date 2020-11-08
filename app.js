const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const { MongoURI } = require('./config/keys');

mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', () => {
  console.log('Connection Failed to MongoDB');
});

require('./models/User');
require('./models/Post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV=='production'){
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}

app.listen(PORT, () => {
  console.log('Server is running on Port:', PORT);
});
