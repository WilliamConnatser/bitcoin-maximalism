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
    title,
    link,
    description
}, {
    User,
    Project,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
        if (title.length > 80) throw new UserInputError('invalid-title');
        if (title.trim() === "") throw new UserInputError('invalid-title');
        if (description.length > 1150) throw new UserInputError('invalid-description');
        if (description.trim() === "") throw new UserInputError('invalid-description');
        if (link.trim() === "") throw new UserInputError('invalid-link');
        if (link.trim() === "") throw new UserInputError('invalid-link');
        if (!link.includes('http')) link = 'http://' + link;

        const project = await Project.findOne({
            title
        });
        if (project) {
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
        const newProject = await new Project({
            _id,
            metaSlug,
            title,
            link,
            description,
            createdBy: user._id
        }).save();

        user.projects.push(newProject._id);
        user.save();

        return _id;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Project'));
    }
}