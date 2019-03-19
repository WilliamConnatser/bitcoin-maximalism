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
    try {
        const rhetoric = await Rhetoric.find({
            approved: true,
            active: true
        });
        const protagonistic = await rhetoric.filter(arg => arg.metaSlug === 'protagonistic' && arg.approved === true).map(arg => arg.slug);
        const antagonistic = await rhetoric.filter(arg => arg.metaSlug === 'antagonistic' && arg.approved === true).map(arg => arg.slug);

        return {
            protagonistic,
            antagonistic
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all users'));
    }
}