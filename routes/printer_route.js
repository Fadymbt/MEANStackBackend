const express = require('express');
const passport = require('passport');
const router = express.Router();

const printerController = require('../controllers/printer_controller');
const adminAuth = require("../config/adminAuthentication");

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

router.post('/addPrinter', adminAuth, printerController.addPrinter);
router.post('/deletePrinter', adminAuth, printerController.deletePrinter)
router.post('/addUserToPrinter', adminAuth, printerController.addUserToPrinter);
router.post('/removeUserFromPrinter', adminAuth, printerController.removeUserFromPrinter);
router.get('/getPrinters', printerController.getPrinters);
router.get('/getUserPrinters', printerController.getUserPrinters);
// router.post('/changePrinterStatus', printerController.changePrinterStatus);
// router.post('/addPrint', printerController.addPrint);


module.exports = router;
