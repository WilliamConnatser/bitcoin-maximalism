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
    token,
    newPassword1,
    newPassword2
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
        let user = await User.findOne({
            username: userObject.username
        });
        if (!user) throw new AuthenticationError('user-not-found');

        if (newPassword1 === newPassword2) {
            user.password = newPassword1;
            await user.save();
        } else {
            throw new UserInputError('un-matching-passwords');
        }

        //Return token 
        return {
            token: createToken(user, process.env.SECRET, "3hr")
        }
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while updating your password'));
    }
}