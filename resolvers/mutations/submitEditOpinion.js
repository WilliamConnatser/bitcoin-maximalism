//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
    documentID,
    opinion
}, {
    Opinion,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (opinion.length > 280) throw new UserInputError('opinion-length');

        const opinionDocument = await Opinion.findOne({
            _id: documentID
        });
        if (!opinionDocument) throw new UserInputError('invalid-id');
        if (!currentUser.admin) {
            throw new UserInputError('admin');
        }

        //Update and Save BulletPoint document
        opinionDocument.opinion = opinion;
        opinionDocument.save();

        return true;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this BulletPoint'));
    }
}