//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    sendPasswordResetEmail,
    parseError
} = require('../helpers');

module.exports = async (_, {
    email
}, {
    User
}) => {
    try {
        //Construct regex for case-insensitive Mongoose query
        const emailRegEx = new RegExp(email.replace('.', '\.'), 'i');

        //Grab the user document
        const user = await User.findOne({
            email: emailRegEx
        });

        //Validation
        if (!user) throw new UserInputError('user-not-found');
        if (!user.emailVerified) throw new AuthenticationError('verify-email')

        //Construct and send email verification
        sendPasswordResetEmail(user);
        return true;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while sending your password reset email'));
    }
}