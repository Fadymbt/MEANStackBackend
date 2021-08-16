const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const homeRoutes = require('./routes/home_route');
const userRoutes = require('./routes/user_route');
const fileRoutes = require('./routes/file_route');
const statusRoutes = require('./routes/status_route');


require('./config/passport');
require('dotenv').config();

// Start Database Connection
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,

});
mongoose.connection.on('connected', () => {
    console.log('==================================== Database Connected ====================================');
});
mongoose.connection.on('error', () => {
    console.log('==================================== Database Failed ====================================');
});

// Cross-Origin middleware to help with cross platform requests
app.use(cors({origin :true, credentials: true}));

// logging HTTP requests
app.use(morgan('dev'));

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files like images and g-code files
app.use(express.static("./public"));

// Passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

// Config Passport middleware for authentication
require('./config/passport')(passport);

// Routes setup
app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/file', fileRoutes);
app.use('/status', statusRoutes);

// Error handling
app.use((req, res, next) => { //404 Not Found
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const error = err.message || 'Error processing your request';

    res.status(status).send({
        message : error
    })
});

module.exports = app;
