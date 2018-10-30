const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        unique: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Todo', TodoSchema)