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
    BulletPoint
}) => {
    try {

        //Queried for a single document
        if (_id !== undefined) {

            const bulletPoint = await BulletPoint.findOne({
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

            if (!bulletPoint) throw new UserInputError('invalid-id');

            return [bulletPoint];
        }

        //Queried for all documents
        else {

            const bulletPoint = await BulletPoint.find({
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

            return bulletPoint;
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved bulletpoints'));
    }
}