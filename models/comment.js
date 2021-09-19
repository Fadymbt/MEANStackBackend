const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    status_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    liked_by: [String],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('comment', CommentSchema);
