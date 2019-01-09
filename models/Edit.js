//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const EditSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    slug: {
        type: String
    },
    pro: {
        type: Boolean,
        required: true
    },
    old: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    new: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    dateApproved: {
        type: Date
    },
    applicableDonation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    },
    opinions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Opinion'
    }
});

module.exports = mongoose.model('Edit', EditSchema);