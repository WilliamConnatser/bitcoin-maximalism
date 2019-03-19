//Encrypt password
const bcrypt = require("bcrypt");

//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
} = require('apollo-server');

//Resolver helpers
const {
    createToken,
    parseError
} = require('../helpers');

module.exports = async (_, {
    email,
    password
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
        if (!user) {
            throw new AuthenticationError("user-not-found");
        }
        if (!user.emailVerified) throw new ForbiddenError('verify-email');
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new AuthenticationError("invalid-password");
        }

        //Return login token
        return {
            token: createToken(user, process.env.SECRET, '3hr')
        }
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while signing in'));
    }
}