//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const DonationSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    publicKey: {
        type: String,
        required: true,
        trim: true
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
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    pro: {
        type: Boolean
    },
    applicableAction: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    edits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Edit'
    },
    dateLastEdited: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', DonationSchema);