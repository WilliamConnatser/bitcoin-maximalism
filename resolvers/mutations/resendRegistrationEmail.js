//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    sendRegistrationEmail,
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
        if (user.emailVerified) throw new UserInputError('already-verified');

        //Construct and send email verification
        sendRegistrationEmail(user);

        return true;
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while re-sending your verification email'));
    }
}