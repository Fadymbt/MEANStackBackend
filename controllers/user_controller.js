const User = require("../models/user");
const jwt = require("jsonwebtoken");

let userController = {};

userController.register = async (req, res, next) => {
    const { first_name, last_name, user_name, email, password } = req.body;
    const newUser = new User({
        first_name,
        last_name,
        user_name,
        email,
        password
    });

    try {
        const user = await newUser.save();
        return res.send({ user });
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
            next(new Error("User already exists"));
        } else {
            next(error);
        }
    }
};

userController.login = async (request, response, next) => {
    const { user_name, password } = request.body;
    try {
        const user = await User.findOne({ user_name });
        if (!user) {
            const err = new Error(`${ user_name } was not found`);
            err.status = 401;
            return next(err);
        }
        // console.log("User", user);
        user.isPasswordMatch(password, user.password, (err, matched) => {
            if (matched) {
                // Generate jwt if credentials okay
                // The JWT secret
                const secret = process.env.SECRET_KEY;
                // Token validity time
                const expire = process.env.EXPIRES_IN;
                // For now just id but we can pass all the user object {sub:user._id}
                const token = jwt.sign({ _id: user._id }, secret, {
                    expiresIn: expire
                });

                response.send({ token, user });
            } else {
                response.status(401).send({
                    error: "Incorrect username or password",
                });
            }
        });
    } catch (error) {
        next(error);
    }
};

userController.getUser = (req, res, next) => {
    const message = req.body;
    res.send(message);
};

module.exports = userController;
