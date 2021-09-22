const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
      type: Boolean,
      default: false
    },
    profile_picture: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Custom Functionality for Authentication System Using bcrypt
 */
UserSchema.pre('save', async function (next) {
    console.log("this: ", this);
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error)
    }

});

/**
 *  Checks if password is a match
 *
 * @param password
 * @param hashed
 * @param callback
 */
UserSchema.methods.isPasswordMatch = function (password, hashed, callback) {
    bcrypt.compare(password, hashed, (err, success) => {
        if (err) {
            return callback(err);
        }
        return callback(null, success);
    });
};

/**
 * Removes password and token from user object
 *
 * @returns {*}
 */
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.token;
    return userObject;
};

module.exports = User = mongoose.model('user', UserSchema);
