const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/User');

/* GET home page. */
router.get('/', (req, res) => {
    res.send('WHY YOU HERE?!')
});

router.post('/register', (req, res) => {
    const today = new Date();
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    };

    User.findOne({
        email: req.body.email,
        user_name: req.body.user_name
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash;
                    User.create(userData)
                        .then(user => {
                            res.send({'registered': 'success'})
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                res.send({error: "User already exists"})
            }
        })
        .catch(err => {
            res.send({error: +"User already exists"})
        })
});

// router.post('/login', (req, res) => {
//     User.findOne({
//         user_name: req.body.user_name
//     })
//         .then(user => {
//             if (user) {
//                 if (bcrypt.compareSync(req.body.password, user.password)) {
//                     // Passwords match
//                     const payload = {
//                         _id: user._id,
//                         first_name: user.first_name,
//                         last_name: user.last_name,
//                         user_name: user.user_name,
//                         email: user.email
//                     };
//                     let token = jwt.sign(payload, process.env.SECRET_KEY, {
//                         expiresIn: "24h"
//                     });
//                     res.send({token : token})
//                 } else {
//                     res.send({error: 'Incorrect Username or password'})
//                 }
//             } else {
//                 res.send({error: 'User does not exist'})
//             }
//         })
//         .catch(err => {
//             console.log(err);
//         })
// });

    router.post('/login', (req, res, next) => {
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log(info.message);
                return res.send({error : info.message});
            }

            const payload = {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name,
                email: user.email
            };

            const options = {
                subject: `${user._id}`,
                expiresIn: '24h'
            };

            const token = jwt.sign(payload, process.env.SECRET_KEY, options);
            res.send({token: token});
        })(req, res, next)
    });

    router.get('/profile', (req, res) => {
        const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

        User.findOne({
            where: {
                id: decoded._id
            }
        })
            .then(user => {
                if (user) {
                    res.send(user)
                } else {
                    res.send('User does not exist')
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
    });

    module.exports = router;
