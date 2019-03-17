//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const EditSchema = new mongoose.Schema({
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
        type: String,
        required: true,
    },
    metaSlug: {
        type: String,
        required: true
    },
    oldDocumentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    newDocumentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['BulletPoint', 'Resource', 'Rhetoric', 'Project']
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
    votes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Vote',
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Edit', EditSchema);