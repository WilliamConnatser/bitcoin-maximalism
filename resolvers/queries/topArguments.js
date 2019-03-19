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
    onModel,
    descending,
    limit
}, {
    Rhetoric
}) => {
    try {
        if (onModel !== 'Opinion' && onModel !== 'Vote') throw new UserInputError('invalid-model');
        if (limit < 1) throw new UserInputError('invalid-limit');

        if (onModel === 'Opinion') {
            let rhetoric = await Rhetoric.find({
                    approved: true,
                    active: true
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

            return await rhetoric.sort((a, b) => {
                if (descending) {
                    return b.opinions.length - a.opinions.length;
                } else {
                    return a.opinions.length - b.opinions.length;
                }
            }).slice(0, limit);

        } else {
            let rhetoric = await Rhetoric.find({
                    approved: true,
                    active: true
                })
                .populate({
                    path: 'votes',
                    model: 'Vote',
                    populate: {
                        path: 'createdBy',
                        model: 'User',
                        select: '_id username accruedDonations'
                    }
                });

            return await sortByVote(rhetoric, descending).slice(0, limit);
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these arguments'));
    }
}