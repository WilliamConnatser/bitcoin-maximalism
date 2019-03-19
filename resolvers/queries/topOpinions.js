//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    sortByVote,
    parseError
} = require('../helpers');

module.exports = async (_, {
    descending,
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
            });

        return await sortByVote(opinions, descending).slice(0, limit);

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these arguments'));
    }
}