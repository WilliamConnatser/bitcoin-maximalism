//Jsonwebtoken for user auth
const jwt = require("jsonwebtoken");

//Send email
const {
    emailTransporter,
    registrationEmail,
    passwordResetEmail
} = require('../smtp');

//BTCPayServer Client
const btcPayClient = require('../btcpay');

//Apollo Error
const {
    ApolloError
} = require('apollo-server');

//MongoDB / Mongoose dependency & Models
const Donation = require('../models/Donation');
const User = require('../models/User');

const createToken = ({
    _id,
    username,
    email,
    admin,
    emailVerified,
    accruedDonations
}, secret, expiresIn) => {
    try {
        return jwt.sign({
            _id,
            username,
            email,
            admin,
            emailVerified,
            accruedDonations
        }, secret, {
            expiresIn
        });
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unkown error occurred while creating your token'));
    }
};

const sendRegistrationEmail = user => {
    try {
        const emailObject = registrationEmail;
        const emailValidationToken = createToken(user, process.env.SECRET, "1d");
        emailObject.to = user.email;
        emailObject.text += `www.BitcoinMaximalism.com/verify-email/${emailValidationToken}`;
        emailObject.html += `<a href="www.BitcoinMaximalism.com/verify-email/${emailValidationToken}">www.BitcoinMaximalism.com/verify-email/${emailValidationToken}</a>`;
        emailTransporter.sendMail(emailObject);
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unkown error occurred while sending email verification'));
    }
}

const sendPasswordResetEmail = user => {
    try {
        const emailObject = passwordResetEmail;
        const emailValidationToken = createToken(user, process.env.SECRET, "1h");
        emailObject.to = user.email;
        emailObject.text += `www.BitcoinMaximalism.com/verify-password/${emailValidationToken}`;
        emailObject.html += `<a href="www.BitcoinMaximalism.com/verify-password/${emailValidationToken}/">www.BitcoinMaximalism.com/verify-password/${emailValidationToken}</a>`;
        emailTransporter.sendMail(emailObject);
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unkown error occurred while sending your password reset email'));
    }
}

const createInvoice = async (amount, currentUser) => {
    try {
        const invoiceObject = {
            price: amount,
            currency: 'BTC',
            buyer: {
                name: currentUser.username,
                email: currentUser.email
            },
            itemDesc: `${amount} BTC donation by ${currentUser.username}`
        }

        return await btcPayClient.create_invoice(invoiceObject);

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating the invoice'));
    }
}

const createDonation = async (amount, invoice, currentUser, otherUserDocument, applicableDocument) => {

    try {
        const donationObject = {
            _id: require('mongodb').ObjectID(),
            invoiceID: invoice.id,
            invoiceURL: invoice.url,
            createdBy: currentUser._id,
            createdFor: otherUserDocument._id
        }

        console.log(applicableDocument)

        //If the donation is for influence, then the applicableDocument parameter will be undefined
        //So, it's known that it is an accruing donation meant to be contributed towards the user's influence weight
        if (applicableDocument === undefined) {
            donationObject.accruing = true;
            donationObject.onModel = 'User';

            //Bonus Percentage for Open Beta
            //There may be Bonus Percentages for purchasing items or subscriptions in the future
            donationObject.bonusPercentage = 0.25;
            donationObject.preBonusAmount = Number(amount);
            donationObject.amount = amount * (donationObject.bonusPercentage + 1);

        } 
        
        //Else If it's a donation to an open source project
        //These types of donations are only made by the Administrator on behalf of BitcoinMaximalism.com
        else if (applicableDocument.description !== undefined) {
            donationObject.onModel = 'Project';
            donationObject.documentID = applicableDocument._id;
            donationObject.metaSlug = applicableDocument.metaSlug;
            donationObject.accruing = false;
            donationObject.amount = amount;
            donationObject.preBonusAmount = amount;
            donationObject.paid = true;
        }

        //Else If a certificate was purchased
        //Not currently implemented..
        else if (applicableDocument.certificateType !== undefined) {        
            donationObject.onModel = 'Certificate';
            donationObject.documentID = applicableDocument._id;
            donationObject.accruing = false;
            donationObject.amount = amount;
        }

        return await new Donation(donationObject).save();

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating the donation.'));
    }
}

const invoicePaid = async (donation, applicableDocument) => {
    try {
        const updatedInvoice = await btcPayClient.get_invoice(donation.invoiceID);
        //If the invoice was paid. Allow 5% leeway for user error having to do with fees
        //TODO: Change to > in production
        if (Number(updatedInvoice.btcPaid) > donation.preBonusAmount * 0.95) {
            donation.paid = true;

            //If the document is a User document, then it's an accruing donation towards influence weight
            if (applicableDocument.username) {
                //Todo change in production = Number(updatedInvoice.btcPaid);
                donation.preBonusAmount = Number(updatedInvoice.btcPaid);
                donation.amount = donation.preBonusAmount * (donation.bonusPercentage + 1);
                adjustDonationInfluence(await donation.save());

            } else {
                donation.amount = Number(updatedInvoice.amountPaid);
                donation.save();
            }

            return true;

        } else if (updatedInvoice.status === 'expired') {
            //Else If it has been over 15 minutes, and the invoice has expired
            donation.active = false;
            donation.save();
        }

        return false;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while checking the status of your invoice.'));
    }
}

const adjustUserInfluence = async user => {
    try {
        let accruedDonations = 0;

        user.donations.forEach(donation => {
            if (donation.paid && donation.createdFor.toString() === user._id.toString()) {
                accruedDonations += donation.amount;
            }
        });

        user.referrals.forEach(referredUser => {
            referredUser.donations.forEach(donation => {
                if (donation.paid && donation.createdFor.toString() === referredUser._id.toString()) {
                    accruedDonations += donation.amount * 0.1;
                }
            });
        });

        user.accruedDonations = accruedDonations;
        
        //The Administrator account's influence should not be updated.
        //It will make donations on behalf of the website to Projects
        //But these donations should not effect influence
        //I think it's easier to filter it out here than in every applicable query/mutation/method
        if(user.username !== 'Administrator') {
            user.save();
        }

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while adjusting your influence'));
    }
}

const adjustDonationInfluence = async donation => {
    try {
        const donationUser = await User.findOne({
                _id: donation.createdFor
            })
            .populate({
                path: 'donations',
                model: 'Donation'
            })
            .populate({
                path: 'referredBy',
                model: 'User'
            })
            .populate({
                path: 'referrals',
                model: 'User',
                populate: {
                    path: 'donations',
                    model: 'Donation'
                }
            });
        adjustUserInfluence(donationUser);

        if (donationUser.referredBy) {
            const referralUser = await User.findOne({
                    _id: donationUser.referredBy
                })
                .populate({
                    path: 'donations',
                    model: 'Donation'
                })
                .populate({
                    path: 'referrals',
                    model: 'User',
                    populate: {
                        path: 'donations',
                        model: 'Donation'
                    }
                });
            adjustUserInfluence(referralUser);
        }
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while adjusting your influence'));
    }
}

const validateDonationAmount = (donationAmount, bitcoinValue) => {
    try {
        if (isNaN(Number(donationAmount))) {
            throw new UserInputError('donation-numeric');
        } else if (donationAmount < 0) {
            throw new UserInputError('donation-negative');
        } else if (Number(donationAmount) === 0) {
            throw new UserInputError('donation-nonzero');
        } else if (donationAmount * bitcoinValue < 1) {
            throw new UserInputError('donation-minimum');
        } else if (donationAmount.indexOf('.') < 0) {
            //If no decimals, then no need to check for max decimals
            return true;
        } else if (donationAmount.toString().split(".")[1].length > 8) {
            throw new UserInputError('donation-decimals');
        } else {
            return true;
        }
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while validating your donation amount.'));
    }
}

const calculateVotes = voteArray => {
    let cumulativeVote = 0;
    voteArray.forEach(vote => {
        if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
        else cumulativeVote -= vote.createdBy.accruedDonations;
    });
    return cumulativeVote;
}

const sortByVote = (documentArray, descending) => {
    return documentArray.sort((a, b) => {
        if (descending) {
            return calculateVotes(b.votes) - calculateVotes(a.votes);
        } else {
            return calculateVotes(a.votes) - calculateVotes(b.votes);
        }
    });
}

const calculateDonations = donationArray => {
    let cumulativeDonations = 0;
    donationArray.forEach(donation => {
        if (donation.paid) cumulativeDonations += donation.preBonusAmount;
    });
    return cumulativeDonations;
}

const sortByDonation = (documentArray, descending) => {
    return documentArray.sort((a, b) => {
        if (descending) {
            return calculateDonations(b.donations) - calculateDonations(a.donations);
        } else {
            return calculateDonations(a.donations) - calculateDonations(b.donations);
        }
    });
}

const parseError = (error, unknownError) => {
    //Known errors which return a slug have special notifications in the onError property inside /client/apolloProvider.js
    if (error == 'log-in') return 'log-in';
    else if (error == 'already-upvoted') return 'You already upvoted this';
    else if (error == 'already-downvoted') return 'You already downvoted this';
    else if (error == 'user-not-found') return 'User not found';
    else if (error == 'verify-email') return 'verify-email';
    else if (error == 'invalid-password') return 'Invalid password';
    else if (error == 'opinion-length') return 'Opinions must be less than 280 characters';
    else if (error == 'donation-minimum') return 'Donation amount must be at least one US dollar';
    else if (error == 'donation-numeric') return 'Donation amount must be numeric';
    else if (error == 'donation-negative') return 'Donation amount must be positive';
    else if (error == 'donation-nonzero') return 'Donation amount must be non-zero';
    else if (error == 'donation-decimals') return 'Donation amount must only have one .';
    else if (error == 'invalid-token') return 'Invalid or expired token';
    else if (error == 'already-verified') return 'Email already verified';
    else if (error == 'username-taken') return 'This username is already taken';
    else if (error == 'username-length') return 'Usernames must be less than 26 characters';
    else if (error == 'un-matching-password') return 'Passwords must match';
    else if (error == 'email-taken') return 'Email address already in use';
    else if (error == 'invalid-referral') return 'Invalid referral link, clear your cookies';
    else if (error == 'invalid-id') return 'Invalid document ID submitted';
    else if (error == 'invalid-model') return 'Invalid model submitted';
    else if (error == 'invalid-sort-index') return 'Invalid number requested';
    else if (error == 'invalid-sort-type') return 'Invalid sort type';
    else if (error == 'invalid-sort-order') return 'Invalid sort order';
    else if (error == 'invalid-variable') return 'Invalid query variable';
    else if (error == 'invalid-limit') return 'Invalid query limit';
    else if (error == 'already-exists') return 'What you submitted already exists';
    else if (error == 'invalid-bulletpoint') return 'Invalid bulletpoint submitted';
    else if (error == 'invalid-media') return 'Invalid media type submitted';
    else if (error == 'invalid-link') return 'Invalid link submitted';
    else if (error == 'invalid-title') return 'Invalid title submitted';
    else if (error == 'invalid-slug') return 'Invalid slug submitted';
    else if (error == 'invalid-rhetoric') return 'Invalid rhetoric submitted';
    else if (error == 'invalid-argument-type') return 'Invalid argument type';
    else if (error == 'invalid-description') return 'Invalid description';
    else if (error == 'admin') return 'You must be an admin';
    else if (error == 'edit-submission-unauthorized') return 'You may only edit submissions you created';
    else if (error == 'edit-submission-approved') return 'Submissions that were already approved can not be edited';
    else if (error == 'unauthorized') return 'You are not authorized to view this';
    else {
        console.log(error)
        return unknownError;
    }
}

module.exports = {
    createToken,
    sendRegistrationEmail,
    sendPasswordResetEmail,
    createInvoice,
    createDonation,
    validateDonationAmount,
    invoicePaid,
    calculateVotes,
    sortByVote,
    sortByDonation,
    parseError
};