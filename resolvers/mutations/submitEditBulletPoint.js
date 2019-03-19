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
    content
}, {
    Rhetoric,
    BulletPoint,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (content.length > 1150) throw new UserInputError('invalid-bulletpoint');
        if (content.trim() === "") throw new UserInputError('invalid-bulletpoint');
        if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
        if (await Rhetoric.findOne({
                slug,
                approved: true,
                active: true
            }) === null) throw new UserInputError('invalid-slug');

        const bulletPoint = await BulletPoint.findOne({
            _id: documentID
        });
        if (!bulletPoint) throw new UserInputError('invalid-id');
        if (!bulletPoint.createdBy.equals(currentUser._id) && !currentUser.admin) {
            throw new UserInputError('edit-submission-unauthorized');
        }
        if (bulletPoint.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

        //Update and Save BulletPoint document
        bulletPoint.metaSlug = metaSlug;
        bulletPoint.slug = slug;
        bulletPoint.content = content;
        bulletPoint.save();

        return true;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this BulletPoint'));
    }
}