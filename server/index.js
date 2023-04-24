const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const KEY = `mongodb+srv://thomas:123@artsite.qllzjcj.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(KEY)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// parse body to json
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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