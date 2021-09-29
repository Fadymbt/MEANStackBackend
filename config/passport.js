const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

// Checks if the request header contains a valid jwt token
module.exports = (passport) => {
    let config = {};
    config.secretOrKey = process.env.SECRET_KEY;
    config.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

    passport.use(new JwtStrategy(config, async (jwtPayload, done) => {
        try {
            console.log("JWTPAYLOAD : ", jwtPayload);

            const user = await User.findById(jwtPayload._id);

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }

        } catch (error) {
            return done(error, false);
        }
    }))
};
