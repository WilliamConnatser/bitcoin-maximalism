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
    onModel,
    documentID,
    approved,
    approvalCommentary
}, {
    BulletPoint,
    Resource,
    Rhetoric,
    Project,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (!currentUser.admin) throw new UserInputError('admin');
        if (onModel !== 'BulletPoint' && onModel !== 'Resource' && onModel !== 'Rhetoric' && onModel !== 'Project') throw new UserInputError('invalid-model')

        switch (onModel) {
            case "BulletPoint":
                var applicableDocument = await BulletPoint.findOne({
                    _id: documentID
                });
                break;

            case "Resource":
                var applicableDocument = await Resource.findOne({
                    _id: documentID
                });
                break;

            case "Rhetoric":
                var applicableDocument = await Rhetoric.findOne({
                    _id: documentID
                });

            case "Project":
                var applicableDocument = await Project.findOne({
                    _id: documentID
                });
        }

        if (!applicableDocument) throw new UserInputError('invalid-id');

        //Update and Save The Applicable Document
        applicableDocument.approved = approved;
        applicableDocument.approvalCommentary = approvalCommentary;
        applicableDocument.dateApproved = new Date();
        applicableDocument.approvedBy = currentUser._id;
        applicableDocument.save();

        return true;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
    }
}