//Apollo errors
const {
    ApolloError
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, args, {
    Rhetoric
}) => {
    // args not deconstructed to make it easier to pass into Query
    // args destructed = { metaSlug: String, slug: String }
    try {

        //Sanitize query object
        //Only return active and approved arguments
        args.approved = true;
        args.active = true;

        //Construct an array of the Rhetoric model
        const rhetoric = await Rhetoric
            .findOne(args)
            .populate({
                path: 'bulletPoints',
                model: 'BulletPoint',
                //Sanitize Bulletpoints
                //Only include approved and active Bulletpoints
                match: {
                    approved: true,
                    active: true
                },
                populate: {
                    path: 'votes',
                    model: 'Vote',
                    populate: {
                        path: 'createdBy',
                        model: 'User',
                        //Sanitize User documents
                        //Only _id username and accruedDonations
                        //(accruedDonations for calculating vote weighting)
                        select: '_id username accruedDonations'
                    }
                }
            })
            .populate({
                path: 'resources',
                model: 'Resource',
                //Sanitize Resources
                //Only include approved and active Resources
                match: {
                    approved: true,
                    active: true
                },
                populate: {
                    path: 'votes',
                    model: 'Vote',
                    populate: {
                        path: 'createdBy',
                        model: 'User',
                        //Sanitize User documents
                        //Only _id username and accruedDonations
                        //(accruedDonations for calculating vote weighting)
                        select: '_id username accruedDonations'
                    }
                }
            })
            .populate({
                path: 'votes',
                model: 'Vote',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    //Sanitize User documents
                    //Only _id username and accruedDonations
                    //(accruedDonations for calculating vote weighting)
                    select: '_id username accruedDonations'
                }
            });

        //Return populated and sanitized array
        return rhetoric;
    
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching argument-specific rhetoric'));
    }
}