//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
    _id
}, {
    Rhetoric
}) => {
    try {

        //Queried for a single document
        if (_id !== undefined) {

            const rhetoric = await Rhetoric.findOne({
                    _id
                })
                .populate({
                    path: 'createdBy',
                    model: 'User',
                    select: '_id username accruedDonations'
                })
                .populate({
                    path: 'approvedBy',
                    model: 'User',
                    select: '_id username accruedDonations'
                });

            if (!rhetoric) throw new UserInputError('invalid-id');

            return [rhetoric];
        }

        //Queried for all documents
        else {

            const rhetoric = await Rhetoric.find({
                    active: true,
                    approved: false
                })
                .populate({
                    path: 'createdBy',
                    model: 'User',
                    select: '_id username accruedDonations'
                })
                .populate({
                    path: 'approvedBy',
                    model: 'User',
                    select: '_id username accruedDonations'
                });

            return rhetoric;
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved arguments'));
    }
}