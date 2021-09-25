const express = require('express');
const passport = require('passport');
const router = express.Router();

const statusController = require('../controllers/status_controller');

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
router.post('/addStatus', statusController.addStatus);
router.get('/getAllStatuses', statusController.getAllStatuses);
router.get('/getUserStatuses', statusController.getUserStatuses);
router.post('/deleteStatus', statusController.deleteStatus);
router.post('/likeStatus', statusController.likeStatus)
router.post('/dislikeStatus', statusController.dislikeStatus)

module.exports = router;
