//Import Mongoose Dependency
const mongoose = require('mongoose');

//Define Model Schema
const CryptoSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    valueUSD: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Crypto', CryptoSchema);