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
    Resource
}) => {
    try {

        //Queried for a single document
        if (_id !== undefined) {

            const resource = await Resource.findOne({
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

            if (!resource) throw new UserInputError('invalid-id');

            return [resource];
        }

        //Queried for all documents
        else {

            const resource = await Resource.find({
                    approved: false,
                    active: true
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

            return resource;
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved resources'));
    }
}