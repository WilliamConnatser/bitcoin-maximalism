//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const ResourceSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    },
    link: {
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
    donations: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Donation'
    }
});

module.exports = mongoose.model('Resource', ResourceSchema)