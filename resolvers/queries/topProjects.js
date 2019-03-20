//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    sortByVote,
    parseError
} = require('../helpers');

module.exports = async (_, {
    onModel,
    descending,
    limit
}, {
    Project
}) => {
    try {
        //Validation
        if (onModel !== 'Opinion' && onModel !== 'Vote') throw new UserInputError('invalid-model');
        if (limit < 1) throw new UserInputError('invalid-limit');

        //If requesting most/least opinionated
        if (onModel === 'Opinion') {

            //Populate an array of approved and active Projects
            let projects = await Project.find({
                    approved: true,
                    active: true
                })
                .populate({
                    path: 'votes',
                    model: 'Vote',
                    populate: {
                        path: 'createdBy',
                        model: 'User',
                        //User document sanitation
                        select: '_id username accruedDonations'
                    }
                })

            //Sort the array and shorten it to the limit
            return await projects.sort((a, b) => {
                if (descending) {
                    return b.opinions.length - a.opinions.length;
                } else {
                    return a.opinions.length - b.opinions.length;
                }
            }).slice(0, limit);

        } else {
            //Else, most upvoted/downvoted projects were requested
            //Get a list of active and approved Projects
            let projects = await Rhetoric.find({
                    approved: true,
                    active: true
                })
                .populate({
                    path: 'votes',
                    model: 'Vote',
                    populate: {
                        path: 'createdBy',
                        model: 'User',
                        //Sanitize user document
                        select: '_id username accruedDonations'
                    }
                });
            
            //Return the sorted array and shorten it accordingly
            return await sortByVote(projects, descending).slice(0, limit);
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these projects'));
    }
}