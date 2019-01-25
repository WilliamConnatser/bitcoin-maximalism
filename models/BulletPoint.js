//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const BulletPointSchema = new mongoose.Schema({
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
    slug: {
        type: String,
        required: true
    },
    pro: {
        type: Boolean,
        required: true
    },
    content: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalCommentary: {
        type: String
    },
    edits: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Edit'
    },
    opinions: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Opinion'
    },
    originalDonation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    },
    accruedVotes: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('BulletPoint', BulletPointSchema);