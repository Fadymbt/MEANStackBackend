const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer = require("multer");


const fileController = require('../controllers/file_controller');

const fileStoreLocation = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './uploads');
    },
    filename: (req,file,cb) => {
        cb(null, req.user._id + "_" + Date.now() + "_" + file.originalname);
    }
});
let upload = multer({storage: fileStoreLocation}).single('file');

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
router.post('/uploadFile', upload, fileController.uploadFile);
router.post('/downloadFile', fileController.downloadFile);
router.post('/deleteFile', fileController.deleteFile);
router.post('/getFiles', fileController.getFiles);

module.exports = router;
