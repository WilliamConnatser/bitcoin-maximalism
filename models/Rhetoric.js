//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const RhetoricSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
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
    }
});

module.exports = mongoose.model('Rhetoric', RhetoricSchema);