//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const RhetoricSchema = new mongoose.Schema({
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
    slug: {
        type: String,
        required: true
    },
    metaSlug: {
        type: String,
        required: true
    },
    title: {
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
    bulletPoints: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'BulletPoint'
    },
    resources: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Resource'
    },
    opinions: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Opinion'
    },
    edits: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Edit'
    },
    votes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Vote',
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Rhetoric', RhetoricSchema);