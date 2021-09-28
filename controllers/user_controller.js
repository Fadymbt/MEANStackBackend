const User = require("../models/user");
const Status = require("../models/status");
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

let userController = {};

userController.register = async (req, res, next) => {
    const {first_name, last_name, user_name, email, password, user_type} = req.body;
    const newUser = new User({
        first_name,
        last_name,
        user_name,
        email,
        password,
        is_admin: user_type === 'Admin'
    });

    try {
        const user = await newUser.save();
        return res.send({user});
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
            next(new Error("User already exists"));
        } else {
            next(error);
        }
    }
};

userController.login = async (req, res, next) => {
    const {user_name, password} = req.body;
    try {
        const user = await User.findOne({user_name});
        if (!user) {
            const err = new Error(`${user_name} was not found`);
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
                const token = jwt.sign({_id: user._id}, secret, {
                    expiresIn: expire
                });

                res.send({token, user});
            } else {
                res.status(401).send({
                    error: "Incorrect username or password",
                });
            }
        });
    } catch (error) {
        next(error);
    }
};


userController.getUsers = async (req, res, next) => {
    try {
        const users = {};
        const allUsers = await User.find(users);
        res.send(allUsers);
    } catch (error) {
        next(error);
    }
};

userController.deleteUser = async (req, res, next) => {
    try {
        const userId = req.body._id;
        await User.deleteOne({_id: userId});
        await Status.deleteOne({user_id: userId});
        await Comment.deleteOne({user_id: userId});
        res.send({message: "User Deleted Successfully"});
    } catch (error) {
        next(error);
    }
};

userController.changePassword = async (req, res, next) => {
    const {user_name, old_password, new_password} = req.body;

    try {
        const user = await User.findOne({user_name});
        if (!user) {
            const err = new Error(`${user_name} was not found`);
            err.status = 401;
            return next(err);
        }

        user.isPasswordMatch(old_password, user.password, (err, matched) => {
            if (matched) {
                const userId = user._id;
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(new_password, salt).then(hashed => {
                        User.updateOne({ _id : userId }, { "$set" : { password : hashed }}).then(()=>{
                            res.send({message: "Password Updated Successfully"});
                        });
                    });
                });
            } else {
                res.send("Incorrect password");
            }
        });
    } catch (error) {
        next(error);
    }
};

userController.updateUserProfilePicture = async (req, res, next) => {
    try {
        let user_id = req.user._id;
        let profilePicURL = req.body.profile_picture;
        await User.updateOne({_id: user_id}, {$set: {profile_picture: profilePicURL}});
        res.send({profile_picture: profilePicURL});
    } catch (error) {
        next(error);
    }
}

userController.updateUserFirstName = async (req, res, next) => {
    try {
        let user_id = req.body.user_id;
        let first_name = req.body.first_name;
        await User.updateOne({_id: user_id}, {$set: {first_name: first_name}});
        res.send("First Name Updated Successfully");
    } catch (error) {
        next(error);
    }
}

userController.updateUserLastName = async (req, res, next) => {
    try {
        let user_id = req.body.user_id;
        let last_name = req.body.last_name;
        await User.updateOne({_id: user_id}, {$set: {last_name: last_name}});
        res.send("Last Name Updated Successfully");
    } catch (error) {
        next(error);
    }
}

userController.updateUserEmailName = async (req, res, next) => {
    try {
        let user_id = req.body.user_id;
        let email = req.body.email;
        await User.updateOne({_id: user_id}, {$set: {email: email}});
        res.send("Email Updated Successfully");
    } catch (error) {
        next(error);
    }
}

userController.updateUserAccessRights = async (req, res, next) => {
    try {
        let user_id = req.body.user_id;
        let is_admin = req.body.is_admin;
        await User.updateOne({_id: user_id}, {$set: {is_admin: is_admin}});
        res.send("Email Updated Successfully");
    } catch (error) {
        next(error);
    }
}

module.exports = userController;
