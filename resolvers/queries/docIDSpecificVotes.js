//Apollo errors
const {
    ApolloError
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
    _id,
    onModel
}, {
    Vote
}) => {
    try {
        return await Vote.find({
            documentID: _id,
            onModel
        }).populate({
            path: 'createdBy',
            model: 'User',
            select: '_id username accruedDonations'
        });
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while counting this document\'s opinions'));
    }
}