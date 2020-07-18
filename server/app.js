const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const { MongoURI } = require('./keys');

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

app.get('/', (req, res) => {
  res.send('hi');
});

app.listen(PORT, () => {
  console.log('Server is running on Port:', PORT);
});
