//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const DonationSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    ticker: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    slug: {
        type: String,
        require: true
    },
    pro: {
        type: Boolean,
        required: true
    },
    applicableDocument: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        enum: ['BulletPoint', 'Opinion', 'Resource', 'Rhetoric', 'Certificate']
    }
});

module.exports = mongoose.model('Donation', DonationSchema);