const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlateSchema = new Schema({
    size: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('plate', PlateSchema);
