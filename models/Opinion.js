//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const OpinionSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdBy: {
        type: String,
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
    opinion: {
        type: String,
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
    approvedBy: {
        type: String
    },
    approvalCommentary: {
        type: String
    },
    documentID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['BulletPoint', 'Edit', 'Resource', 'Rhetoric'],
        required: true
    },
    originalDonation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    }
});

module.exports = mongoose.model('Opinion', OpinionSchema);