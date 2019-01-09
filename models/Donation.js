//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const DonationSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    ticker: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    slug: {
        type: String,
        require: true
    },
    pro: {
        type: Boolean,
        required: true
    },
    typeCategory: {
        type: String,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

module.exports = mongoose.model('Donation', DonationSchema);