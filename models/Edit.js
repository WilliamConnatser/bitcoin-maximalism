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
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
    },
    pro: {
        type: Boolean,
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
        enum: ['BulletPoint', 'Resource', 'Rhetoric']
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

module.exports = mongoose.model('Edit', EditSchema);