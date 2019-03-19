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

        const users = await User.find({}, '_id username accruedDonations referrals');
        const processedUsers = [];

        users.forEach(user => {
            processedUsers.push({
                _id: user._id,
                username: user.username,
                referralAmount: user.referrals.length
            });
        });

        return await processedUsers.sort((a, b) => {
            return b.referralAmount - a.referralAmount;
        }).filter(user => user.username !== 'Administrator').slice(0, limit);

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these users'));
    }
}