//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const RhetoricSchema = new mongoose.Schema({
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
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    dateApproved: {
        type: Date
    },
    approvedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
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
    donations: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Donation'
    }
});

module.exports = mongoose.model('Rhetoric', RhetoricSchema);