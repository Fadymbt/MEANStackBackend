const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrinterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'idle',
        required: true
    },
    current_print_end_time: {
        type: Number
    },
    queue: [
        {
            file_name: String,
            printing_time: Number
        }
    ],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = Printer = mongoose.model('printer', PrinterSchema);
