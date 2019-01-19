//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const DonationSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    ticker: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    pro: {
        type: Boolean,
        required: true
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        enum: ['BulletPoint', 'Opinion', 'Resource', 'Rhetoric', 'Certificate', 'User', 'Edit']
    }
});

module.exports = mongoose.model('Donation', DonationSchema);