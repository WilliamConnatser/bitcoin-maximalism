//Jsonwebtoken for user auth
const jwt = require("jsonwebtoken");

//Apollo errors
const {
    ApolloError,
    AuthenticationError,
} = require('apollo-server');

//Resolver helpers
const {
    createToken,
    parseError
} = require('../helpers');

module.exports = async (_, {
    token
}, {
    User
}) => {
    try {

        //Validation
        try {
            var userObject = await jwt.verify(token, process.env.SECRET)
        } catch (err) {
            throw new AuthenticationError('invalid-token');
        }

        //Update User document
        const user = await User.findOne({
            username: userObject.username
        });
        if (!user) throw new AuthenticationError('user-not-found');
        if (!user.emailVerified) throw new AuthenticationError('verify-email')

        //Return token 
        return {
            token: createToken(user, process.env.SECRET, "3hr")
        }
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while verifying your email'));
    }
}