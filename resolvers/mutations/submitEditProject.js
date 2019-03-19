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
    title,
    link,
    description
}, {
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
            _id: documentID
        });
        if (!project) throw new UserInputError('invalid-id');
        if (!project.createdBy.equals(currentUser._id) && !currentUser.admin) throw new UserInputError('edit-submission-unauthorized');
        if (project.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

        //Update and Save Project Document
        project.metaSlug = metaSlug;
        project.title = title;
        project.link = link;
        project.description = description;
        project.save();

        return true;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Project'));
    }
}