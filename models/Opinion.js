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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: {
        type: String
    },
    metaSlug: {
        type: String,
        required: true
    },
    opinion: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: true,
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
        enum: ['BulletPoint', 'Resource', 'Rhetoric', 'Project'],
        required: true
    },
    votes: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'Vote',
        default: []
    }
});

module.exports = mongoose.model('Opinion', OpinionSchema);