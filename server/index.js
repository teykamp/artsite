const express = require('express');
const app = express();
const mongoose = require('mongoose');

const KEY = `mongodb+srv://thomas:123@artsite.qllzjcj.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(KEY)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// parse body to json
app.use(express.json());

// import routes
const postsRoute = require('./posts.js');
app.use('/posts', postsRoute);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});