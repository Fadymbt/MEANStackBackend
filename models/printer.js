const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrinterSchema = new Schema({
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

module.exports = Printer = mongoose.model('printer', PrinterSchema);
