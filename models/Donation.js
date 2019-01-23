//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const DonationSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    username: {
        type: String,
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
    slug: {
        type: String,
        required: true
    },
    pro: {
        type: Boolean,
        required: true
    },
    documentID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        require: true
    },
    onModel: {
        type: String,
        enum: ['BulletPoint', 'Opinion', 'Resource', 'Rhetoric', 'Certificate', 'User', 'Edit']
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
    }
});

module.exports = mongoose.model('Donation', DonationSchema);