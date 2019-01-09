//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const CertificateSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
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
    applicableDonation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Donation'
    }
});

module.exports = mongoose.model('Certificate', CertificateSchema);