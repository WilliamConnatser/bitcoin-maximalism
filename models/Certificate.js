//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const CertificateSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    pro: {
        type: Boolean,
        required: true
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Donation'
    }
});

module.exports = mongoose.model('Certificate', CertificateSchema);