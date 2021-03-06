//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const CertificateSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    activeUntil: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    protagonistic: {
        type: Boolean,
        required: true
    },
    donationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    }
});

module.exports = mongoose.model('Certificate', CertificateSchema);