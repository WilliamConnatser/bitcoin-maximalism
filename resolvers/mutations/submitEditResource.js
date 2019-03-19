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
    title,
    media,
    link
}, {
    Rhetoric,
    Resource,
    currentUser
}) => {
    try {
        //Validation & Sanitation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (title.length > 280) throw new UserInputError('invalid-title');
        if (title.trim() === "") throw new UserInputError('invalid-title');
        if (media !== "article" && media !== "blog" && media !== "podcast" &&
            media !== "video" && media !== "whitepaper" && media !== "website") throw new UserInputError('invalid-media');
        if (media.trim() === "") throw new UserInputError('invalid-media');
        if (link.trim() === "") throw new UserInputError('invalid-link');
        if (link.trim() === "") throw new UserInputError('invalid-link');
        if (!link.includes('http')) link = 'http://' + link;
        if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
        if (await Rhetoric.findOne({
                slug,
                approved: true,
                active: true
            }) === null) throw new UserInputError('invalid-slug');

        const resource = await Resource.findOne({
            _id: documentID
        });
        if (!resource) throw new UserInputError('invalid-id');
        if (!resource.createdBy.equals(currentUser._id) && !currentUser.admin) {
            throw new UserInputError('edit-submission-unauthorized');
        }
        if (resource.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

        //Edit and Save Resource document
        resource.metaSlug = metaSlug;
        resource.slug = slug;
        resource.title = title;
        resource.media = media;
        resource.link = link;
        resource.save();

        return true;

    } catch (err) {
        console.log(err)
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
    }
}