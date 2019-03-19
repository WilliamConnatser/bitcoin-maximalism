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
    Opinion
}) => {
    try {
        return await Opinion.find({
            approved: true,
            documentID: _id,
            onModel
        }).countDocuments();
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while counting this document\'s opinions'));
    }
}