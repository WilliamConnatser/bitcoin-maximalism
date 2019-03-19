//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = allProjects = async (_, {
    metaSlug
}, {
    Project
}) => {
    try {

        //Default query if no Meta Slug is provided
        const queryObject = {
            approved: true,
            active: true
        }

        //Query if Meta Slug is provided
        if (metaSlug) {
            if (metaSlug !== 'protagonistic' && metaSlug !== 'antagonistic') {
                throw new UserInputError('invalid-variable');
            } else {
                queryObject.metaSlug = metaSlug;
            }
        }

        //Use query object to get an array of Rhetoric documents
        const projects = await Project
            .find(queryObject)
            .populate({
                path: 'votes',
                model: 'Vote',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    //Sanitize user documents
                    select: '_id username accruedDonations'
                }
            });

        //Return an Array of Projects
        return projects;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all projects'));
    }
}