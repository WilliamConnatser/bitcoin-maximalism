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

        const users = await User.find({}, '_id username referrals')
            .populate({
                path: 'referrals',
                model: 'User',
                select: '_id',
                populate: {
                    path: 'donations',
                    model: 'Donation'
                }
            });

        const processedUsers = [];

        users.forEach(user => {
            user.referralInfluence = 0;
            user.referrals.forEach(referredUser => {
                referredUser.donations.forEach(donation => {
                    if (donation.paid) {
                        user.referralInfluence += donation.amount * 0.1;
                    }
                });
            });

            processedUsers.push({
                _id: user._id,
                username: user.username,
                referralInfluence: user.referralInfluence
            });
        });

        return processedUsers.sort((a, b) => {
            return b.referralInfluence - a.referralInfluence;
        }).filter(user => user.username !== 'Administrator').slice(0, limit);

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these users'));
    }
}