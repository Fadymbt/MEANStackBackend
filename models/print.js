const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrintsSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
        required: true
    },
    printer_id: {
        type: String,
        required: true
    },
    print_start_time: Number,
    print_end_time: Number,
    duration: Number,
    active: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = Prints = mongoose.model('prints', PrintsSchema);
