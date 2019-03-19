//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    createInvoice,
    createDonation,
    validateDonationAmount,
    parseError
} = require('../helpers');

module.exports = async (_, {
    amount,
    userID
}, {
    Crypto,
    User,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        const bitcoinValue = await Crypto.findOne({
            ticker: 'BTC'
        }).valueUSD;
        validateDonationAmount(amount, bitcoinValue);

        const currentUserDocument = await User.findOne({
            _id: currentUser._id
        });
        if (!currentUserDocument) throw new UserInputError('user-not-found');

        var otherUserDocument;
        if (currentUser._id === userID) {
            otherUserDocument = currentUserDocument;
        } else {
            otherUserDocument = await User.findOne({
                _id: userID
            });
        }
        if (!otherUserDocument) throw new UserInputError('user-not-found');

        const newInvoice = await createInvoice(amount, currentUser);
        const newDonation = await createDonation(amount, newInvoice, currentUser, currentUserDocument, otherUserDocument);

        currentUserDocument.donations.push(newDonation._id);
        currentUserDocument.save();

        if (currentUser._id !== userID) {
            otherUserDocument.donations.push(newDonation._id);
            otherUserDocument.save();
        }

        //Return donation ID
        return newDonation._id;
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while approving this opinion'));
    }
}