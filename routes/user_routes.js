const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user_controller');
const adminAuth = require("../config/adminAuthentication");

//Login and Sign up localhost:5000/user/login
router.post('/register', userController.register);
router.post('/login', userController.login);


/**
 * Customize auth message Protect the routes
 * and prevent copy paste of jwt token
 */
router.all('*', (req, res, next) => {
    console.log("body : ", req.body);
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            const error = new Error('Unauthorised Access');
            error.status = 401;
            // The middleware will catch the error
            throw error;
        }
        req.user = user;
        // Get user object from every request when user is logged in
        return next();
    })(req, res, next); // Passport middleware
});

/**
 *
 */
router.get('/admin', adminAuth, (req, res, next) => {
        console.log("body : ", req.body);
        return res.send({
            status: 200,
            user: req.user
        })
    });

router.get('/logincheck', (req, res, next) => {
        return res.send({
            message: "User Authorised",
            user: req.user
        })
    });

router.get('/getUser', adminAuth, userController.getUser);

module.exports = router;
