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
    Opinion,
    currentUser
}) => {
    try {
        //Validation
        if (!currentUser) throw new AuthenticationError('log-in');
        if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
        if (!currentUser.admin) throw new UserInputError('admin');
        if (onModel !== 'BulletPoint' && onModel !== 'Resource' && onModel !== 'Rhetoric' && onModel !== 'Project' && onModel !== 'Opinion') throw new UserInputError('invalid-model')

        //Grab the applicable document depending on which model the applicable resource is
        //If it's a BulletPoint, Resource, or Opinion, then it is tied to a Rhetoric document
        //Via an array of document IDs. Grab that because it the applicable resource document id
        //Will likely need to be added or removed from this array.
        switch (onModel) {
            case "BulletPoint":
                var applicableDocument = await BulletPoint.findOne({
                    _id: documentID
                });
                var applicableRhetoricProperty = 'bulletPoints';
                break;

            case "Resource":
                var applicableDocument = await Resource.findOne({
                    _id: documentID
                });
                var applicableRhetoricProperty = 'resources';
                break;

            case "Rhetoric":
                var applicableDocument = await Rhetoric.findOne({
                    _id: documentID
                });
                break;

            case "Project":
                var applicableDocument = await Project.findOne({
                    _id: documentID
                });
                break;

            case "Opinion":
                var applicableDocument = await Opinion.findOne({
                    _id: documentID
                });
                var applicableRhetoricProperty = 'bulletPoints';
                break;
        }

        if (!applicableDocument) throw new UserInputError('invalid-id');

        //Update and Save The Applicable Document
        applicableDocument.approved = approved;
        applicableDocument.approvalCommentary = approvalCommentary;
        applicableDocument.dateApproved = new Date();
        applicableDocument.approvedBy = currentUser._id;
        applicableDocument.save();

        if (applicableRhetoricProperty !== undefined) {

            //Grab the applicable rhetoric document
            const rhetoricDocument = await Rhetoric.findOne({
                metaSlug: applicableDocument.metaSlug,
                slug: applicableDocument.slug
            });

            //If the document is already in the applicable property array of document Ids
            //And the document was unapproved
            if (rhetoricDocument[applicableRhetoricProperty].find(docId => docId.equals(applicableDocument.id)) && !approved) {
                
                //Remove the document ID from the array if it's already present
                const index = rhetoricDocument[applicableRhetoricProperty].findIndex(docId => docId.equals(applicableDocument.id));
                if (index !== -1) {
                    rhetoricDocument[applicableRhetoricProperty].splice(index, 1);
                }
            }

            //Else if the document is not already in the applicable property array of document Ids
            //And the document was approved
            else if (!rhetoricDocument[applicableRhetoricProperty].find(docId => docId.equals(applicableDocument.id)) && approved) {
                
                //Add the document ID to the array if it's not already present
                const index = rhetoricDocument[applicableRhetoricProperty].findIndex(docId => docId.equals(applicableDocument.id));
                if (index === -1) {
                    rhetoricDocument[applicableRhetoricProperty].push(applicableDocument.id);
                }
            }

            //Save the document
            rhetoricDocument.save();
        }

        return true;

    } catch (err) {
        console.log(err)
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
    }
}