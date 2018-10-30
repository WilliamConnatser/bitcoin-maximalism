//Mongoose Schema
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        unique: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    completed: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Todo', TodoSchema)