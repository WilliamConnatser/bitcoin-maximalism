//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const DonationSchema = new mongoose.Schema({
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
    createdFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticker: {
        type: String,
        required: true,
        default: 'BTC'
    },
    amount: {
        type: Number,
        required: true
    },
    bonusPercentage: {
        type: Number
    },
    preBonusAmount: {
        type: Number
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    paid: {
        type: Boolean,
        required: true,
        default: false
    },
    invoiceID: {
        type: String,
        required: true
    },
    invoiceURL: {
        type: String,
        required: true
    },
    accruing: {
        type: Boolean,
        required: true
    },
    onModel: {
        type: String,
        enum: ['Certificate', 'User', 'Project'],
        required: true
    },
    documentID: {
        type: String
    },
    metaSlug: {
        type: String
    }
});

module.exports = mongoose.model('Donation', DonationSchema);