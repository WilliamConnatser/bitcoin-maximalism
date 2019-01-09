//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const ResourceSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    slug: {
        type: String
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
    applicableDonation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    },
    edits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Edit'
    },
    dateLastEdited: {
        type: Date,
        required: true,
        default: Date.now
    },
    opinions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Opinion'
    }
});

module.exports = mongoose.model('Resource', ResourceSchema)