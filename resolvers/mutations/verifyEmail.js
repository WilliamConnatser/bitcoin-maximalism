//Jsonwebtoken for user auth
const jwt = require("jsonwebtoken");

//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    UserInputError,
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
        let userObjectFromToken = {};
        //Validation
        await jwt.verify(token, process.env.SECRET, function (err, userObject) {
            if (err) throw new AuthenticationError('invalid-token');
            userObjectFromToken = userObject
        });
        if (userObjectFromToken.emailVerified) throw new UserInputError("already-verified");

        //Update User document
        const user = await User.findOne({
            username: userObjectFromToken.username
        });
        if (!user) throw new AuthenticationError('user-not-found');
        user.emailVerified = true;
        user.save();

        //Return token 
        return {
            token: createToken(user, process.env.SECRET, "3hr")
        }
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while verifying your email'));
    }
}