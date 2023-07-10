const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()
const serverConfig = require('./serverConfig')



function connectToDatabase() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Production MongoDB connected...'))
    .catch(err => console.log(err));
}



// parse body to json
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// import routes
const postsRoute = require('./posts.js');
app.use('/', postsRoute);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

const PORT = process.env.PORT || 3000;

function startApp() {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
}


if (serverConfig.getIsProdServer()) {
  connectToDatabase();
  startApp();
}

module.exports = app;
