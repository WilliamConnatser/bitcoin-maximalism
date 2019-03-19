//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.export = async (_, {
    _id
}, {
    Donation,
    currentUser
}) => {
    try {
        if (!_id) throw new UserInputError('invalid-id');
        //Donation info has to do with financial privacy, so only the user should be able to access their own donations.
        if (!currentUser) throw new AuthenticationError('log-in');
        const donation = await Donation.findOne({
                _id
            })
            .populate({
                path: 'createdBy',
                model: 'User',
                select: '_id username accruedDonations'
            })
            .populate({
                path: 'createdFor',
                model: 'User',
                select: '_id username accruedDonations'
            });

        if (!donation) throw new UserInputError('invalid-id');
        if (donation.createdBy._id.toString() !== currentUser._id &&
            donation.createdFor._id.toString() !== currentUser._id) throw new AuthenticationError('unauthorized');

        else return donation;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching this donation'));
    }
}