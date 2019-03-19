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
    opinion
}, {
    Project,
    Rhetoric,
    Opinion,
    BulletPoint,
    Resource,
    User,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (opinion.length > 280) throw new UserInputError('opinion-length');
        if (onModel !== 'BulletPoint' && onModel !== 'Resource' && onModel !== 'Rhetoric' && onModel !== 'Project') throw new UserInputError('invalid-type');
        //TODO: Write helper function: ValidateOpinion(opinion)

        //Create Invoice, Donation document, and Opinion document
        switch(onModel) {
            case 'BulletPoint':
                var applicableDocument = await BulletPoint.findOne({
                    _id: documentID
                });
                break;
            case 'Resource':
                var applicableDocument = await Resource.findOne({
                    _id: documentID
                });
                break;
            case 'Rhetoric':
                var applicableDocument = await Rhetoric.findOne({
                    _id: documentID
                });
                break;
            case 'Project':
                var applicableDocument = await Project.findOne({
                    _id: documentID
                });
                break;
        }

        let userDocument = await User.findOne({
            _id: currentUser._id
        });

        if (!applicableDocument) throw new UserInputError('invalid-id');
        if (!userDocument) throw new UserInputError('user-not-found');

        let opinionObject = {
            _id: require('mongodb').ObjectID(),
            dateCreated: new Date(),
            createdBy: currentUser._id,
            metaSlug: applicableDocument.metaSlug,
            onModel,
            documentID,
            opinion,
            approved: true,
            censored: false,
            votes: []
        };

        if (onModel !== 'Rhetoric' && onModel !== 'Project') {
            opinionObject.slug = applicableDocument.slug;
        }

        //Save the Opinion document, the User document, and the applicableDocument
        const newOpinion = await new Opinion(opinionObject).save();
        userDocument.opinions.push(newOpinion._id);
        userDocument.save();
        applicableDocument.opinions.push(newOpinion._id);
        applicableDocument.save();

        return currentUser.accruedDonations;
    } catch (err) {
        console.log(err)
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this opinion'));
    }
}