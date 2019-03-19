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
    Project
}) => {
    try {

        //Queried for a single document
        if (_id !== undefined) {

            const project = await Project.findOne({
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

            if (!project) throw new UserInputError('invalid-id');

            return [project];
        }

        //Queried for all documents
        else {

            const project = await Project.find({
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

            return project;
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved projects'));
    }
}