//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    invoicePaid,
    parseError
} = require('../helpers');

module.exports = async (_, {
    _id
}, {
    Donation,
    User,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');

        const userDocument = await User.findOne({
            _id: currentUser._id
        });
        if (!userDocument) throw new UserInputError('user-not-found');

        const donationDocument = await Donation.findOne({
            _id
        });
        if (!donationDocument) throw new UserInputError('user-not-found');

        if (donationDocument.paid) {
            return true;
        } else {
            const donationPaid = await invoicePaid(donationDocument, userDocument);
            return donationPaid;
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while checking this donation'));
    }
}