const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

passport.use(new LocalStrategy({
    usernameField: 'user_name',
    passwordField: 'password'
    },
    (user_name, password, done) => {
        User.findOne({
            user_name: user_name
        }, (err, result) => {
            if (err) return done(err);

            if (result.length === 0) {
                return done(null, false, {message: 'Incorrect username'})
            }

            const user = result;
            bcrypt.compare(password, user.password, (err, result) => {
                if (!result) {
                    return done(null, false, {message : 'Incorrect password'})
                }
                return done(null, user)
            })
        })
    }));
