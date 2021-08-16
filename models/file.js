const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelFileSchema = new Schema({
    file_name: {
        type: String,
        required: true,
        unique: true
    },
    original_name: {
        type: String,
        required: true,
    },
    download_url: {
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

module.exports = User = mongoose.model('files', ModelFileSchema);
