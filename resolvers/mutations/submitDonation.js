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
    userID,
    onModel,
    documentID
}, {
    Crypto,
    User,
    Project,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if(onModel && !currentUser.admin) throw new ForbiddenError('admin');
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

        let applicableDocument;
        if (currentUser.admin) {
            applicableDocument = await Project.findOne({_id: documentID})
        } else {
            applicableDocument = undefined;
        }

        const newInvoice = await createInvoice(amount, currentUser);
        const newDonation = await createDonation(amount, newInvoice, currentUser, otherUserDocument, applicableDocument);

        currentUserDocument.donations.push(newDonation._id);
        currentUserDocument.save();

        if (currentUser._id !== userID) {
            otherUserDocument.donations.push(newDonation._id);
            otherUserDocument.save();
        }

        if(applicableDocument) {
            applicableDocument.donations.push(newDonation._id);
            applicableDocument.save();
        }

        //Return donation ID
        return newDonation._id;
    } catch (err) {
        console.log(err)
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while approving this opinion'));
    }
}