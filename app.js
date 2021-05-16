const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

require('./config/passport');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const mongoURI = 'mongodb://localhost:27017/mean_stack';

mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
