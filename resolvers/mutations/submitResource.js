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
    metaSlug,
    slug,
    title,
    media,
    link
}, {
    Rhetoric,
    User,
    Resource,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (title.length > 280) throw new UserInputError('invalid-title');
        if (title.trim() === "") throw new UserInputError('invalid-title');
        if (media !== "article" && media !== "blog" && media !== "podcast" &&
            media !== "video" && media !== "whitepaper" && media !== "website") throw new UserInputError('invalid-media');
        if (media.trim() === "") throw new UserInputError('invalid-media');
        if (link.trim() === "") throw new UserInputError('invalid-link');
        if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
        if (await Rhetoric.findOne({
                slug,
                approved: true,
                active: true
            }) === null) throw new UserInputError('invalid-slug');
        if (!link.includes('http')) link = 'http://' + link;

        const resource = await Resource.findOne({
            link
        });
        if (resource) {
            throw new UserInputError('already-exists');
        }

        const user = await User.findOne({
            _id: currentUser._id
        });
        if (!user) {
            throw new UserInputError('user-not-found');
        }

        //Create Resource document
        let _id = require('mongodb').ObjectID();
        const newResource = await new Resource({
            _id,
            metaSlug,
            slug,
            title,
            media,
            link,
            createdBy: user._id
        }).save();

        user.resources.push(newResource._id)
        user.save();

        return _id;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Resource'));
    }
}