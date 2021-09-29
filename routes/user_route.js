const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user_controller');
const adminAuth = require("../config/adminAuthentication");

//Login and Sign up localhost:3000/user/login
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
 * Add Protected Routes under this comment
 */
router.post('/register', adminAuth, userController.register);
router.get('/getUsers', adminAuth, userController.getUsers);
router.post('/deleteUser', adminAuth, userController.deleteUser);
router.put('/changePassword', userController.changePassword);
router.put('/updateUserProfilePicture', userController.updateUserProfilePicture);
router.put('/updateUserFirstName', adminAuth, userController.updateUserFirstName);
router.put('/updateUserLastName', adminAuth, userController.updateUserLastName);
router.put('/updateUserEmail', adminAuth, userController.updateUserEmail);
router.put('/updateUserAccessRights', adminAuth, userController.updateUserAccessRights);


module.exports = router;
