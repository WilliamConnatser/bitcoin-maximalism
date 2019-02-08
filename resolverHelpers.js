//Jsonwebtoken for user auth
const jwt = require("jsonwebtoken");

//Send email
const {
    emailTransporter,
    registrationEmail,
    passwordResetEmail
} = require('./smtp');

//BTCPayServer client
const btcPayClient = require('./btcpay');

//Apollo errors
const {
    ApolloError
} = require('apollo-server-express');

//MongoDB / Mongoose dependency & Models
const mongoose = require('mongoose');
const Rhetoric = require('./models/Rhetoric');
const Edit = require('./models/Edit');
const Opinion = require('./models/Opinion');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');
const Donation = require('./models/Donation');
const BulletPoint = require('./models/BulletPoint');
const User = require('./models/User');
const Vote = require('./models/Vote');
const Crypto = require('./models/Crypto');

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

const sendRegistrationEmail = async user => {
    try {
        var emailObject = registrationEmail;
        const emailValidationToken = createToken(user, process.env.SECRET, "1d");
        emailObject.to = user.email;
        emailObject.text += `www.BitcoinMaximalism.com/verify-email/${emailValidationToken}`;
        emailObject.html += `<a href="www.BitcoinMaximalism.com/verify-email/${emailValidationToken}">Verify Email</a>`;
        emailTransporter.sendMail(emailObject);
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unkown error occurred while sending email verification'));
    }
}

const sendPasswordResetEmail = async user => {
    try {
        var emailObject = passwordResetEmail;
        const emailValidationToken = createToken(user, process.env.SECRET, "1h");
        emailObject.to = user.email;
        emailObject.text += `www.BitcoinMaximalism.com/verify-password/${emailValidationToken}`;
        emailObject.html += `<a href="www.BitcoinMaximalism.com/verify-password/${emailValidationToken}/">Verify Password</a>`;

        console.log(emailObject)
        emailTransporter.sendMail(emailObject);
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unkown error occurred while sending your password reset email'));
    }
}

const createInvoice = async (amount, currentUser) => {
    try {
        var invoiceObject = {
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

const createDonation = async (amount, invoice, currentUser, applicableDocument) => {

    try {
        console.log(applicableDocument)
        var donationObject = {
            _id: require('mongodb').ObjectID(),
            invoiceID: invoice.id,
            invoiceURL: invoice.url,
            createdBy: currentUser._id
        }

        //If the document is a User document, then it's an accruing donation towards influence weight
        if (applicableDocument.username) {
            donationObject.accruing = true;
            donationObject.onModel = 'User';

            //Bonus Percentage for Open Beta
            //There may be Bonus Percentages for purchasing items or subscriptions in the future
            donationObject.bonusPercentage = 0.25;
            donationObject.preBonusAmount = Number(amount);
            donationObject.amount = amount * (donationObject.bonusPercentage + 1);

        } else {
            //Document ID is only assigned for non-accruing donations (IE. purchases of items, subscriptions, etc)
            //TODO: create extra conditional on fields of applicableDocument to see what type it is. For now, we assume it's a certificate
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

const invoicePaid = async (invoice, donation, invoiceInterval, applicableDocument) => {
    try {
        const updatedInvoice = await btcPayClient.get_invoice(invoice.id);
        //If the invoice was paid. Allow 5% leeway for user error having to do with fees
        //TODO: On production, change to a greater than sign
        if (updatedInvoice.amountPaid > invoice.btcDue * 0.95) {
            donation.paid = true;

            //If the document is a User document, then it's an accruing donation towards influence weight
            if (applicableDocument.username) {
                //TODO: Replace line in production
                donation.preBonusAmount = Number(updatedInvoice.amountPaid);
                //donation.preBonusAmount = Number(donation.preBonusAmount);
                donation.amount = donation.preBonusAmount * (donation.bonusPercentage + 1);
                adjustDonationInfluence(await donation.save());

            } else {
                donation.amount = Number(updatedInvoice.amountPaid);
                donation.save();
            }

            clearInterval(invoiceInterval);

        } else if (updatedInvoice.status === 'expired') {
            //Else If it has been over 15 minutes, and the invoice has expired
            donation.active = false;
            donation.save();
            clearInterval(invoiceInterval);
        }
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while checking the status of your invoice.'));
    }
}

const adjustUserInfluence = async user => {
    try {
        var accruedDonations = 0;

        console.log(user.username, "influence adjustment in process")

        user.donations.forEach(donation => {
            if (donation.paid) {
                accruedDonations += donation.amount;
            }
        });

        user.referrals.forEach(referredUser => {
            console.log("referred: ", referredUser)
            referredUser.donations.forEach(donation => {
                console.log("donation: ", donation)
                if (donation.paid) {
                    accruedDonations += donation.amount * 0.1;
                }
            });
        });
        console.log('new influence = ' + accruedDonations);

        user.accruedDonations = accruedDonations;
        user.save();

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while adjusting your influence'));
    }
}

const adjustDonationInfluence = async donation => {
    try {
        const donationUser = await User.findOne({
                _id: donation.createdBy
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
    else if (error == 'invalid-type') return 'Invalid type submitted';
    else if (error == 'invalid-sort-index') return 'Invalid number requested';
    else if (error == 'invalid-sort-type') return 'Invalid sort type';
    else if (error == 'invalid-sort-order') return 'Invalid sort order';
    else if (error == 'admin') return 'You must be an admin';
    else if (error == 'unauthorized') return 'You are not authorized to view this';
    else return unknownError;
}

module.exports = {
    createToken,
    sendRegistrationEmail,
    sendPasswordResetEmail,
    createInvoice,
    createDonation,
    validateDonationAmount,
    invoicePaid,
    parseError
};