//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const EditSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
    },
    pro: {
        type: Boolean,
        required: true
    },
    old: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    new: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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