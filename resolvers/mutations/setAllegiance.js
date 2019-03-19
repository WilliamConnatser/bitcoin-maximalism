//Apollo errors
const {
    ApolloError,
    ForbiddenError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
    maximalist
}, {
    User,
    currentUser
}) => {
    try {
        if (!currentUser) {
            throw new Error('You must be logged in to perform this function!')
        }
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');

        const user = await User.findOne({
            username: currentUser.username
        });

        if (!user) {
            throw new UserInputError('user-not-found');
        }
        user.maximalist = maximalist;
        user.save();

        return user.maximalist;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
    }
}