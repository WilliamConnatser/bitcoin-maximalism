//Apollo errors
const {
    ApolloError
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, args, {
    User,
    currentUser
}) => {
    try {
        //Return null if no user is logged in
        //currentUser object is injected into the Apollo GraphQL Context
        //It will be populated with User Data if they can provide a valid JWT token
        if (!currentUser) {
            return null;
        }

        //Populate and sanitize user document
        const user = await User.findOne({
                _id: currentUser._id
            },
            //Exclude the document's password property
            '-password')
            .populate({
                path: 'donations',
                model: 'Donation',
                options: {
                    sort: {
                        'dateCreated': 'descending'
                    }
                }
            })
            .populate({
                path: 'opinions',
                model: 'Opinion',
                populate: {
                    path: 'votes',
                    model: 'Vote',
                    populate: {
                        path: 'createdBy',
                        model: 'User',
                        //Sanitize user document
                        select: '_id username accruedDonations'
                    }
                },
                options: {
                    sort: {
                        'dateCreated': 'descending'
                    }
                }
            })
            .populate({
                path: 'votes',
                model: 'Vote',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    //Sanitize user document
                    select: '_id username accruedDonations'
                },
                options: {
                    sort: {
                        'dateCreated': 'descending'
                    }
                }
            })
            .populate({
                path: 'resources',
                model: 'Resource',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    //Sanitize user document
                    select: '_id username accruedDonations'
                },
                populate: {
                    path: 'approvedBy',
                    model: 'User',
                    //Sanitize user document
                    select: '_id username accruedDonations'
                },
                options: {
                    sort: {
                        'dateCreated': 'descending'
                    }
                }
            })
            .populate({
                path: 'rhetoric',
                model: 'Rhetoric',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    //Sanitize user document
                    select: '_id username accruedDonations'
                },
                populate: {
                    path: 'approvedBy',
                    model: 'User',
                    //Sanitize user document
                    select: '_id username accruedDonations'
                },
                options: {
                    sort: {
                        'dateCreated': 'descending'
                    }
                }
            })
            .populate({
                path: 'bulletPoints',
                model: 'BulletPoint',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    //Sanitize user document
                    select: '_id username accruedDonations'
                },
                populate: {
                    path: 'approvedBy',
                    model: 'User',
                    //Sanitize user document
                    select: '_id username accruedDonations'
                },
                options: {
                    sort: {
                        'dateCreated': 'descending'
                    }
                }
            })

        //Return User Document
        return user;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching this user'));
    }
}