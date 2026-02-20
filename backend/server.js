const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5500;

app.use(cors()); // middleware
app.use(express.json());

// connect to mongodb
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});
// -------------------------

// import the route and call app.use on it
const newsRouter = require('./routes/news');
const usersRouter = require('./routes/users');
const contactRouter = require('./routes/contact');

app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use(contactRouter);
// -------------------------

app.get('/', (req, res) => {
  res.send('App is running!');
});

// starts the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
