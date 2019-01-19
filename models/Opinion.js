//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const OpinionSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    slug: {
        type: String,
        required: true
    },
    pro: {
        type: Boolean,
        required: true
    },
    comment: {
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
    document: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        enum: ['BulletPoint', 'Edit', 'Resource', 'Rhetoric']
    },
    donations: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Donation'
    }
});

module.exports = mongoose.model('Opinion', OpinionSchema);