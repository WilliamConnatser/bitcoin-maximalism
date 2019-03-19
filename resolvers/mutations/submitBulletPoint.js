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
    content
}, {
    Rhetoric,
    User,
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
            content
        });
        if (bulletPoint) {
            throw new UserInputError('already-exists');
        }

        const user = await User.findOne({
            _id: currentUser._id
        });
        if (!user) {
            throw new UserInputError('user-not-found');
        }

        //Create BulletPoint document
        let _id = require('mongodb').ObjectID();
        const newBulletPoint = await new BulletPoint({
            _id,
            metaSlug,
            slug,
            content,
            createdBy: user._id
        }).save();

        user.bulletPoints.push(newBulletPoint._id)
        user.save();

        return _id;

    } catch (err) {
        console.log(err)
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this BulletPoint'));
    }
}