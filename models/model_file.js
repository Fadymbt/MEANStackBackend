const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelFileSchema = new Schema({
    original_name: {
        type: String,
        required: true
    },
    new_name: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true
    },
    liked_by: [String],
    comments_id: [String],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('model_file', ModelFileSchema);
