//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const OpinionSchema = new mongoose.Schema({
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
    comment: {
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
    applicableDocument: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        enum: ['BulletPoint', 'Edit', 'Resource', 'Rhetoric']
    }
});

module.exports = mongoose.model('Opinion', OpinionSchema);