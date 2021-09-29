const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrinterSchema = new Schema({
    name: {
        type: String,
        unique: true,
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
    access_user_id: [{
        type: String,
        dropDups: true
    }],
    printing_queue: [
        {
            _id: Schema.Types.ObjectId,
            user_id: String,
            file_name: String,
            print_start_time: Number,
            print_end_time: Number,
            duration: Number,
            active: {
                type: Boolean,
                default: false
            }
        }
    ],
    finished_prints: [
        {
            user_id: String,
            file_name: String,
            print_start_time: Number,
            print_end_time: Number,
            duration: Number,
            picked_up: {
                type: Boolean,
                default: false
            },
            end_date : {
                type: Date,
                default: Date.now
            }
        }
    ],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = Printer = mongoose.model('printer', PrinterSchema);
