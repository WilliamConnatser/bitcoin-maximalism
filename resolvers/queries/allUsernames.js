//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = allUsernames = async (_, args, {
    User
}) => {
    try {
        //Retrieve all user documents
        //Sanitize documents for username and _id only
        const users = await User.find({}, '_id username');

        //Don't return the Administrator user.
        return users.filter(user => user.username !== 'Administrator');

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all users'));
    }
}