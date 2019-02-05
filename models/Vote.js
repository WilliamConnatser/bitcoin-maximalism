//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const VoteSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateUpdated: {
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
    onModel: {
        type: String,
        required: true
    },
    documentID: {
        type: String,
        required: true
    },
    upVote: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Vote', VoteSchema);