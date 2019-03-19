//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
    limit
}, {
    Opinion
}) => {
    try {
        if (limit < 1) throw new UserInputError('invalid-limit');

        const opinions = await Opinion.find({
                approved: true
            })
            .populate({
                path: 'votes',
                model: 'Vote',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    select: '_id username accruedDonations'
                }
            })
            .populate({
                path: 'createdBy',
                model: 'User',
                select: '_id username accruedDonations'
            })
            .sort({
                dateCreated: 'descending'
            })
            .limit(limit);

        return opinions;
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these opinions'));
    }
}