//Queries
const allProjects = require('./queries/allProjects');
const allRhetoric = require('./queries/allRhetoric');
const allSlugs = require('./queries/allSlugs');
const allUsernames = require('./queries/allUsernames');
const argumentSpecificRhetoric = require('./queries/argumentSpecificRhetoric');
const checkDonation = require('./queries/checkDonation');
const cryptoValue = require('./queries/cryptoValue');
const currentUser = require('./queries/currentUser');
const docIDSpecificDonation = require('./queries/docIDSpecificDonation');
const docIDSpecificOpinionCount = require('./queries/docIDSpecificOpinionCount');
const docIDSpecificOpinions = require('./queries/docIDSpecificOpinions');
const docIDSpecificVotes = require('./queries/docIDSpecificVotes');
const mostInfluentialUsers = require('./queries/mostInfluentialUsers');
const recentOpinions = require('./queries/recentOpinions');
const topAllegiances = require('./queries/topAllegiances');
const topArguments = require('./queries/topArguments');
const topBulletPoints = require('./queries/topBulletPoints');
const topOpinions = require('./queries/topOpinions');
const topProjects = require('./queries/topProjects');
const topResources = require('./queries/topResources');
const mostReferralInfluence = require('./queries/mostReferralInfluence');
const mostReferrals = require('./queries/mostReferrals');
const unapprovedBulletPoints = require('./queries/unapprovedBulletPoints');
const unapprovedProjects = require('./queries/unapprovedProjects');
const unapprovedResources = require('./queries/unapprovedResources');
const unapprovedRhetoric = require('./queries/unapprovedRhetoric');

//Mutations
const resendPasswordEmail = require('./mutations/resendPasswordEmail');
const resendRegistrationEmail = require('./mutations/resendRegistrationEmail');
const resetPassword = require('./mutations/resetPassword');
const setAllegiance = require('./mutations/setAllegiance');
const signinUser = require('./mutations/signinUser');
const signupUser = require('./mutations/signupUser');
const startPasswordReset = require('./mutations/startPasswordReset');
const submitBulletPoint = require('./mutations/submitBulletPoint');
const submitDonation = require('./mutations/submitDonation');
const submitEditBulletPoint = require('./mutations/submitEditBulletPoint');
const submitEditOpinion = require('./mutations/submitEditOpinion');
const submitEditProject = require('./mutations/submitEditProject');
const submitEditResource = require('./mutations/submitEditResource');
const submitEditRhetoric = require('./mutations/submitEditRhetoric');        
const submitOpinion = require('./mutations/submitOpinion');
const submitProject = require('./mutations/submitProject');
const submitResource = require('./mutations/submitResource');
const submitRhetoric = require('./mutations/submitRhetoric');
const submitVote = require('./mutations/submitVote');
const toggleApproval = require('./mutations/toggleApproval');
const verifyEmail = require('./mutations/verifyEmail');
const verifyPasswordReset = require('./mutations/verifyPasswordReset');

module.exports = {
    Query: {
        allProjects,
        allRhetoric,
        allSlugs,
        allUsernames,
        argumentSpecificRhetoric,
        checkDonation,
        cryptoValue,
        currentUser,
        docIDSpecificDonation,
        docIDSpecificOpinionCount,
        docIDSpecificOpinions,
        docIDSpecificVotes,
        mostInfluentialUsers,
        recentOpinions,
        topAllegiances,
        topArguments,
        topBulletPoints,
        topOpinions,
        topProjects,
        topResources,
        mostReferralInfluence,
        mostReferrals,
        unapprovedRhetoric,
        unapprovedBulletPoints,
        unapprovedResources,
        unapprovedProjects
    },
    Mutation: {
        resendPasswordEmail,
        resendRegistrationEmail,
        resetPassword,
        setAllegiance,
        signinUser,
        signupUser,
        startPasswordReset,
        submitBulletPoint,
        submitDonation,    
        submitEditBulletPoint,
        submitEditOpinion,
        submitEditProject,
        submitEditResource,
        submitEditRhetoric,        
        submitOpinion,
        submitProject,
        submitResource,
        submitRhetoric,
        submitVote,
        toggleApproval,
        verifyEmail,
        verifyPasswordReset
    }
}