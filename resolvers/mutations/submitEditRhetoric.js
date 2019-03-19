//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
    documentID,
    metaSlug,
    slug,
    title
}, {
    Rhetoric,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (!/^[a-z0-9-]*$/.test(slug)) throw new UserInputError('invalid-slug');
        if (title.length > 80) throw new UserInputError('invalid-title');
        if (title.trim() === "") throw new UserInputError('invalid-title');
        if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');

        let rhetoric = await Rhetoric.findOne({
            _id: documentID
        });
        if (!rhetoric) throw new UserInputError('invalid-id');
        if (!rhetoric.createdBy.equals(currentUser._id) && !currentUser.admin) {
            throw new UserInputError('edit-submission-unauthorized');
        }
        if (rhetoric.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

        //Update and Save Rhetoric Document
        rhetoric.metaSlug = metaSlug;
        rhetoric.slug = slug;
        rhetoric.title = title;
        rhetoric.save();

        return true;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
    }
}