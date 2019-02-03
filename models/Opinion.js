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
        type: String,
        required: true
    },
    metaSlug: {
        type: String,
        required: true
    },
    opinion: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: true,
    },
    censored: {
        type: Boolean,
        required: true,
        default: false
    },
    dateCensored: {
        type: Date
    },
    censoredBy: {
        type: String
    },
    censoredCommentary: {
        type: String
    },
    documentID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['BulletPoint', 'Resource', 'Rhetoric'],
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