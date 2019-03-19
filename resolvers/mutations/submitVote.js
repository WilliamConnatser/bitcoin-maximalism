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
    upVote
}, {
    Vote,
    BulletPoint,
    Resource,
    Rhetoric,
    Opinion,
    User,
    Project,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (onModel !== 'BulletPoint' &&
            onModel !== 'Resource' &&
            onModel !== 'Rhetoric' &&
            onModel !== 'Opinion' &&
            onModel !== 'Project') throw new UserInputError('invalid-type');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');

        //Get document being voted on & the user document
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
            case 'Opinion':
                var applicableDocument = await Opinion.findOne({
                    _id: documentID
                });
                break;
        }

        const userDocument = await User.findOne({
            _id: currentUser._id
        });

        if (!applicableDocument) throw new UserInputError('invalid-document');
        if (!userDocument) throw new UserInputError('user-not-found');

        //See if the user has already voted for this document.
        const oldVote = await Vote.findOne({
            createdBy: currentUser._id,
            onModel,
            documentID
        });

        //If the user's already voted on this document then update their vote
        //Else create a new vote document, and insert the ID into the applicableDocument.votes and userDocument.votes arrays
        if (oldVote) {
            if (oldVote.upVote === upVote) {
                if (upVote) throw new UserInputError('already-upvoted');
                else throw new UserInputError('already-downvoted');
            } else {
                oldVote.upVote = upVote;
                oldVote.dateUpdated = new Date();
                oldVote.save();
            }
        } else {

            const voteObject = {
                _id: require('mongodb').ObjectID(),
                dateCreated: new Date(),
                dateUpdated: new Date(),
                createdBy: currentUser._id,
                metaSlug: applicableDocument.metaSlug,
                onModel,
                documentID,
                upVote
            }
            if (applicableDocument.__typename !== 'Rhetoric' && applicableDocument.__typename !== 'Project') {
                voteObject.slug = applicableDocument.slug;
            }
            const newVote = await new Vote(voteObject).save();

            userDocument.votes.push(newVote._id);
            userDocument.save();

            applicableDocument.votes.push(newVote._id);
            applicableDocument.save();

            //Not in use
            return userDocument.accruedDonations;
        }
    } catch (err) {
        console.log(err)
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this vote'));
    }
}