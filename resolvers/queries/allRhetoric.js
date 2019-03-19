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
    metaSlug
}, {
    Rhetoric
}) => {
    try {

        //Default query if no Meta Slug is provided
        const queryObject = {
            approved: true,
            active: true
        }

        //Alter default query if Meta Slug is provided
        if (metaSlug) {
            
            //Validate metaSlug param
            if (metaSlug !== 'protagonistic' && metaSlug !== 'antagonistic') {
                throw new UserInputError('invalid-variable');
            } else {
                queryObject.metaSlug = metaSlug;
            }
        }

        //Use Query object to get an array of Rhetoric documents
        const rhetoric = await Rhetoric
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

        //Return an array of Rhetoric documents
        return rhetoric;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all rhetoric'));
    }
}