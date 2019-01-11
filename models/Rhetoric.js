//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const RhetoricSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
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
    bulletPoints: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'BulletPoint'
    },
    resources: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Resource'
    },
    opinions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Opinion'
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
    }
});

module.exports = mongoose.model('Rhetoric', RhetoricSchema);