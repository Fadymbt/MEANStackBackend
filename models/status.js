const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    file_id: {
        type: String
    },
    liked_by: [String],
    comments_id: [String],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('status', StatusSchema);
