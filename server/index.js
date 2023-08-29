const express = require('express');
const app = express();

const bodyParser = require('body-parser');
require('dotenv').config()
const serverConfig = require('./serverConfig')

// parse body to json
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// import routes
const postsRoute = require('./posts.js');
app.use('/api', postsRoute);

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

const PORT = process.env.PORT || 3000;

serverConfig.connectToDatabase(app, PORT);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public/'));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

module.exports = app;
