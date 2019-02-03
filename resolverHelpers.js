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
} = require('apollo-server');

const createToken = ({
    username,
    email,
    admin,
    emailVerified
}, secret, expiresIn) => {
    console.log(username, email, admin, emailVerified)
    try {
        return jwt.sign({
            username,
            email,
            admin,
            emailVerified
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

const createInvoice = async (args, currentUser, transactionType) => {
    try {
        var objectToInsert = {
            price: args.amount,
            currency: 'BTC',
            buyer: {
                name: currentUser.username,
                email: currentUser.email
            }
        }

        if (transactionType === 'Opinion') {
            objectToInsert.itemDesc = `${args.amount} BTC donation for ${currentUser.username}'s opinion on the ${args.onModel} ${args.documentID}: "${args.opinion}"`
        } else if (transactionType === 'Vote') {
            if (args.upVote) {
                var vote = "Upvote";
            } else {
                var vote = "Downvote";
            }
            objectToInsert.itemDesc = `${args.amount} BTC donation for ${currentUser.username}'s ${vote} on the ${args.onModel} ${args.documentID}`
        }

        return await btcPayClient.create_invoice(objectToInsert);

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while interacting with the BTCPay server.'));
    }
}

const createDonation = async (args, applicableDocument, invoice, Donation, currentUser) => {

    try {
        var objectToInsert = {
            _id: require('mongodb').ObjectID(),
            invoiceID: invoice.id,
            invoiceURL: invoice.url,
            onModel: args.onModel,
            documentID: args.documentID,
            createdBy: currentUser.username,
            amount: args.amount,
            slug: applicableDocument.slug,
            pro: applicableDocument.pro,
            votingDonation: false
        }

        if (args.votingDonation) {
            objectToInsert.votingDonation = true;
            objectToInsert.upVote = args.upVote;
        }

        return await new Donation(objectToInsert).save();
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating the donation.'));
    }
}

const createOpinion = async (args, applicableDocument, donation, Opinion, currentUser) => {

    try {
        return await new Opinion({
            _id: require('mongodb').ObjectID(),
            createdBy: currentUser.username,
            slug: applicableDocument.slug,
            pro: applicableDocument.pro,
            opinion: args.opinion,
            documentID: args.documentID,
            onModel: args.onModel,
            originalDonation: donation._id
        }).save();

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating the opinion.'));
    }
}

const applyVote = async (args, applicableDocument, amountPaid) => {
    try {
        if (args.upVote) applicableDocument.accruedVotes += amountPaid;
        else if (!args.upVote) applicableDocument.accruedVotes -= amountPaid;
        return await applicableDocument.save();

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while applying your vote.'));
    }
}

const invoicePaid = async (invoice, donation, invoiceInterval, args, applicableDocument) => {
    try {
        const updatedInvoice = await btcPayClient.get_invoice(invoice.id);

        //If they paid 95% of the amount due (give a little slack for fee discrepancy)
        if (updatedInvoice.amountPaid > (invoice.btcDue * .95)) {
            donation.amount = Number(updatedInvoice.amountPaid);
            donation.paid = true;
            donation.save();

            //If it's a voting donation, then apply the votes to the applicable document
            if (donation.votingDonation) applyVote(args, applicableDocument, updatedInvoice.amountPaid);
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
    if (error == 'log-in') return 'Log in first';
    else if (error == 'user-not-found') return 'User not found';
    else if (error == 'verify-email') return 'Verify your email first';
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
    else if (error == 'invalid-type') return 'Invalid type submitted';
    else if (error == 'invalid-sort-index') return 'Invalid number requested';
    else if (error == 'invalid-sort-type') return 'Invalid sort type';
    else if (error == 'invalid-sort-order') return 'Invalid sort order';
    else if (error == 'admin') return 'You must be an admin';
    else return unknownError;
}

module.exports = {
    createToken,
    sendRegistrationEmail,
    sendPasswordResetEmail,
    createInvoice,
    createOpinion,
    createDonation,
    validateDonationAmount,
    applyVote,
    invoicePaid,
    parseError
};