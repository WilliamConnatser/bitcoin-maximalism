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
    User
}) => {
    try {
        if (limit < 1) throw new UserInputError('invalid-limit');

        const users = await User.find({}, '_id username accruedDonations');

        return await users.sort((a, b) => {
            return b.accruedDonations - a.accruedDonations;
        }).filter(user => user.username !== 'Administrator').slice(0, limit);

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these users'));
    }
}