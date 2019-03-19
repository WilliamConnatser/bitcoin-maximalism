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
    title
}, {
    User,
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

        const rhetoric = await Rhetoric.findOne({
            title
        });
        if (rhetoric) {
            throw new UserInputError('already-exists');
        }

        const user = await User.findOne({
            _id: currentUser._id
        });
        if (!user) {
            throw new UserInputError('user-not-found');
        }

        //Create Rhetoric Document
        let _id = require('mongodb').ObjectID();
        const newRhetoric = await new Rhetoric({
            _id,
            metaSlug,
            slug,
            title,
            createdBy: user._id
        }).save();

        user.rhetoric.push(newRhetoric._id);
        user.save();

        return _id;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
    }
}