//Encrypt password
const bcrypt = require("bcrypt");

//Jsonwebtoken for user auth
const jwt = require("jsonwebtoken");

//Apollo errors
const {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError,
} = require('apollo-server');

//BTCPay server config
const client = require('./btcpay');

//Resolver helpers
const {
    createToken,
    createInvoice,
    createOpinion,
    createDonation,
    invoicePaid,
    parseError
} = require('./resolverHelpers');

module.exports = {
    Query: {
        currentUser: async (_, args, {
            User,
            currentUser
        }) => {
            try {
                //Return null if no user is logged in
                if (!currentUser) {
                    return null;
                }
                //Return the user object
                return await User.findOne({
                    username: currentUser.username
                });
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this user'));
            }
        },
        userSpecificActivity: async (_, args, {
            Donation,
            currentUser
        }) => {
            // args not in use... args parsed = { }
            try {
                //Return null if no user is logged in
                if (!currentUser) {
                    return null;
                }
                //Return the user's previous donations in an array
                return await Donation.find({
                    createdBy: currentUser.username
                });
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this user\'s activity'));
            }
        },
        cryptoValue: async (_, {ticker}, {
            Crypto
        }) => {
            try {
                //Return the cryptocurrency's value
                const value = await Crypto.findOne({
                    ticker: ticker
                });
                return value.valueUSD;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching the value of this cryptocurrency'));
            }
        },
        argumentSpecificRhetoric: async (_, args, {
            Rhetoric
        }) => {
            // args not deconstructed to make it easier to pass into Query
            // args destructed = { pro: Boolean, slug: String }
            try {
                //Only return approved arguments
                args.approved = true;

                const rhetoric = await Rhetoric
                    .findOne(args)
                    .populate({
                        path: 'bulletPoints',
                        model: 'BulletPoint'
                    })
                    .populate({
                        path: 'resources',
                        model: 'Resource'
                    });

                return rhetoric;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching argument-specific rhetoric'));
            }
        },
        allRhetoric: async (_, {
            pro
        }, {
            Rhetoric
        }) => {
            try {
                const rhetoric = await Rhetoric
                    .find({
                        pro: pro,
                        approved: true,
                        active: true
                    })
                    .populate({
                        path: 'bulletPoints',
                        model: 'BulletPoint',
                        match: {
                            approved: true,
                            active: true
                        }
                    })
                    .populate({
                        path: 'resources',
                        model: 'Resource',
                        match: {
                            approved: true,
                            active: true
                        }
                    })
                    .sort({
                        accruedVotes: 'desc'
                    })

                return rhetoric;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching all rhetoric'));
            }
        },
        argumentSpecificDonations: async (_, args, {
            Donation
        }) => {
            // args not destructed to make it easier to pass into Query
            // args destructed = { pro: Boolean, slug: String }
            try {
                const donations = await Donation.find(args).sort({
                    value: 'desc'
                });
                return donations;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching these argument-specific donations'));
            }
        },
        docIDSpecificDonation: async (_, {
            _id
        }, {
            Donation
        }) => {
            try {
                return await Donation.findOne({
                    _id
                })
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching this donation by ID'));
            }
        },
        argumentSpecificAmountDonated: async (_, args, {
            Donation
        }) => {
            // args not destructed to make it easier to pass into Query
            // args destructed = { pro: Boolean, slug: String }
            try {
                //Only return paid donations
                args.paid = true;

                //Helper variable to aggregate value
                var aggregateValue = 0;

                //Get applicable donations
                const donations = await Donation.find(args);

                //For each applicable donation add the amount to the total
                donations.forEach(donation => {
                    aggregateValue += donation.amount;
                });

                return aggregateValue;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching the total amount donated for this argument'));
            }
        },
        docIDSpecificAmountDonated: async (_, args, {
            Donation
        }) => {
            // args not destructed to make it easier to pass into Query
            // args destructed = { pro: Boolean, slug: String, onModel: String, documentID: ID }
            try {
                //Only return paid donations
                args.paid = true;

                //Helper variable to aggregate value
                var aggregateValue = 0;

                //Get applicable donations
                const donations = await Donation.find(args);

                //For each applicable donation add the amount to the total
                donations.forEach(donation => {
                    aggregateValue += donation.amount;
                });

                return aggregateValue;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching the total amount donated for this document'));
            }
        },
        donationSpecificOpinion: async (_, {
            _id
        }, {
            Opinion
        }) => {
            try {
                const opinion = await Opinion.findOne({
                    originalDonation: _id
                })
                return opinion;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching this opinion by donation ID'));
            }
        },
        docIDSpecificRhetoric: async (_, {
            _id
        }, {
            Rhetoric
        }) => {
            try {
                const rhetoric = await Rhetoric.findOne({
                    _id
                })
                return rhetoric;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching this rhetoric by donation ID'));
            }
        },
        docIDSpecificBulletPoint: async (_, {
            _id
        }, {
            BulletPoint
        }) => {
            try {
                const bulletPoint = await BulletPoint.findOne({
                    _id
                })
                return bulletPoint;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching this bulletpoint by donation ID'));
            }
        },
        docIDSpecificResource: async (_, {
            _id
        }, {
            Resource
        }) => {
            try {
                const resource = await Resource.findOne({
                    _id
                })
                return resource;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while fetching this resource by donation ID'));
            }
        },
        allUnapprovedOpinions: async (_, args, {
            Donation,
            Opinion,
            currentUser
        }) => {
            // args not in use... destructed = { }
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.admin) throw new ForbiddenError('admin');

                //Get unapproved opinions that have not been denied
                var unapprovedAndPaidOpinions = [];
                const allUnapprovedOpinions = await Opinion.find({
                    approved: false,
                    approvedBy: {
                        $exists: false
                    }
                });

                //For each unapproved opinion
                await allUnapprovedOpinions.forEach(async opinion => {

                    //See if the applicable donation was paid
                    const donation = await Donation.findOne({
                        _id: opinion.originalDonation
                    });

                    //TODO delete exclamation mark in production
                    if (!donation.paid) {
                        unapprovedAndPaidOpinions.push(opinion);
                    }
                });

                return unapprovedAndPaidOpinions;

            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unknown error occurred while fetching unapproved opinions'));
            }
        },
        allUnapprovedEdits: async (_, args, {
            Donation,
            Edit,
            currentUser
        }) => {
            // args not in use... destructed = { }
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.admin) throw new ForbiddenError('admin');

                //Get all unapproved edits that have not already been denied
                var unapprovedAndPaidEdits = [];
                const allUnapprovedEdits = await Edit.find({
                    approved: false,
                    approvedBy: {
                        $exists: false
                    }
                });

                //For each array item
                await allUnapprovedEdits.forEach(edit => {

                    //See if the applicable donation was paid
                    const donationPaid = Donation.findOne({
                        _id: edit.originalDonation
                    }).paid;

                    //TODO delete exclamation mark in production
                    if (!donationPaid) {
                        unapprovedAndPaidEdits.push(edit);
                    }
                });

                //Return Unapproved and Paid edits in an Array
                return unapprovedAndPaidEdits;

            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unknown error occurred while fetching unapproved opinions'));
            }
        },
        topLastRandomOpinions: async (_, {
            _id,
            onModel
        }, {
            Opinion
        }) => {
            // async query functions run simultaneously with Promise.all in the return statement
            try {

                //Opinion with the biggest donation
                const topOpinion = async () => {

                    //Populate an array with Donation info
                    const answer = await Opinion.find({
                        approved: true,
                        documentID: _id,
                        onModel
                    }).populate({
                        path: 'originalDonation',
                        model: 'Donation'
                    });

                    //Helper to track max value and index
                    var max = {
                        index: null,
                        value: 0
                    }

                    //For each array item, see if it's the biggest
                    await answer.forEach(function (answerItems, i) {
                        if (answerItems.originalDonation.amount > max.value) {
                            max.index = i;
                            max.value = answerItems.originalDonation.amount
                        }
                    })

                    return answer[max.index];
                }

                //Opinion approved last
                const lastOpinion = async () => {

                    //Populate an array with Donation info
                    //Sort by approval date
                    //Limit to one entry (IE... the last opinion approved due to sort)
                    const answer = await Opinion.find({
                            approved: true,
                            documentID: _id,
                            onModel
                        }).populate({
                            path: 'originalDonation',
                            model: 'Donation'
                        })
                        .sort({
                            dateApproved: 'desc'
                        })
                        .limit(1);

                    return answer[0];
                }

                //Random opinion
                const randomOpinion = async () => {

                    //Populate an array of Opinions with Donation info
                    const opinionArray = await Opinion.find({
                        approved: true,
                        documentID: _id,
                        onModel
                    }).populate({
                        path: 'originalDonation',
                        model: 'Donation'
                    });

                    //Return a random array item
                    return opinionArray[Math.floor(Math.random() * opinionArray.length)];
                }

                //Await for all queries above to complete
                return await Promise.all([
                    topOpinion(),
                    lastOpinion(),
                    randomOpinion()
                ]).then(returnValue => {
                    return returnValue;
                });
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while querying for opinions'));
            }
        }
    },
    Mutation: {
        addBulletPoint: async (_, {
            slug,
            pro,
            content
        }, {
            BulletPoint,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.admin) throw new ForbiddenError('admin');
                if (!user.emailVerified) throw new ForbiddenError('verify-email');
                
                const bulletPoint = await BulletPoint.findOne({
                    content
                });
                if (bulletPoint) {
                    throw new UserInputError('This BulletPoint already exists in the database');
                }

                //Create BulletPoint document
                var id = require('mongodb').ObjectID();
                const newBulletPoint = await new BulletPoint({
                    _id: id,
                    slug,
                    pro,
                    content,
                    approved: true
                }).save();

                return newBulletPoint;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while creating this BulletPoint'));
            }
        },
        setUserAllegiance: async (_, {
            allegiance
        }, {
            User,
            currentUser
        }) => {
            try {
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.admin) throw new AuthenticationError('admin');
                if (!user.emailVerified) throw new ForbiddenError('verify-email');

                var newUser = await User.findOne({
                    username: currentUser.username
                }, function (err, user) {

                    if (allegiance === "Maximalist") {
                        user.maximalist = true;
                    } else {
                        user.maximalist = false;
                    }

                    user.allegiance = true;
                    user.save();
                });

                return {
                    token: createToken(newUser, process.env.SECRET, "1hr")
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unknown error has occurred!'));
            }
        },
        signinUser: async (_, {
            email,
            password
        }, {
            User
        }) => {
            try {
                //Validation
                const user = await User.findOne({
                    email
                });
                if (!user) {
                    throw new AuthenticationError("user-not-found");
                }
                if (!user.emailVerified) throw new ForbiddenError('verify-email');
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    throw new AuthenticationError("invalid-password");
                }

                //Return token
                return {
                    token: createToken(user, process.env.SECRET, "1hr")
                }
            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while signing in'));
            }
        },
        verifyEmail: async (_, {
            token
        }, {
            User
        }) => {
            try {
                //Validation
                const userObject = await jwt.verify(token, process.env.SECRET);
                if (!userObject) throw new AuthenticationError('invalid-token')
                if (userObject.emailVerified) throw new UserInputError("already-verified");

                //Update User document
                var user = await User.findOne({
                    username: userObject.username
                });
                if (!user) throw new AuthenticationError('user-not-found');
                user.emailVerified = true;
                user.save();

                //Return token 
                return {
                    token: createToken(user, process.env.SECRET, "1hr")
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unkown error occurred while verifying your email'));
            }
        },
        resendEmail: async (_, {
            email
        }, {
            User
        }) => {
            try {
                //Validation
                const user = await User.findOne({
                    email
                });
                if (!user) throw new UserInputError("user-not-found");
                if (user.emailVerified) throw new UserInputError("already-verified");

                //Construct and send email verification
                sendRegistrationEmail(user);

                return true;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unknown error occurred while re-sending your verification email'));
            }
        },
        signupUser: async (_, {
            username,
            email,
            password
        }, {
            User
        }) => {
            try {
                //Validation
                const userInUse = await User.findOne({
                    username
                });
                if (userInUse) throw new UserInputError("username-taken");
                if (username.length > 25) throw new UserInputError("username-length");
                const emailInUse = await User.findOne({
                    email
                });
                if (emailInUse) throw new UserInputError("email-taken");

                //Construct the user object to be inserted
                var userObject = {
                    username,
                    email,
                    password
                }
                //If this is the first user registering, then make them an Admin
                if (await User.findOne() == undefined) {
                    userObject.admin = true;
                }
                //Save new user to the database
                const newUser = await new User(userObject).save();

                //Construct and send email verification
                sendRegistrationEmail(user);

                return true;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unknown error occurred while creating your user'));
            }
        },
        submitOpinion: async (_, args, {
            Crypto,
            Donation,
            Opinion,
            BulletPoint,
            Resource,
            currentUser
        }) => {
            // Args not destructed for easier passage to helper functions
            // Args destructed = {amount: String!, documentID: ID!, onModel: String!, opinion: String!}
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (args.opinion.length > 280) throw new UserInputError('opinion-length');
                const cryptoDoc = await Crypto.findOne({
                    ticker: 'BTC'
                });
                if (cryptoDoc.valueUSD * Number(args.amount) < 1) throw new UserInputError('donation-minimum');
                if (args.onModel !== 'BulletPoint' && args.onModel !== 'Resource') throw new UserInputError('invalid-type');


                //Create Invoice, Donation document, and Opinion document
                var applicableDocument = {};
                (args.onModel === 'BulletPoint') ? applicableDocument = await BulletPoint.findOne({
                    _id: args.documentID
                }): applicableDocument = await Resource.findOne({
                    _id: args.documentID
                });
                const newInvoice = await createInvoice(args, currentUser, args.onModel);
                const newDonation = await createDonation(args, applicableDocument, newInvoice, Donation, currentUser);
                await createOpinion(args, applicableDocument, newDonation, Opinion, currentUser);

                //Check every 5 minutes to see if the invoice has been paid
                var invoiceInterval;
                invoiceInterval = setInterval(invoicePaid(newInvoice, newDonation, invoiceInterval), 300000);

                //Return invoice URL
                return newInvoice.url;
            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message,'An unknown error occurred while submitting this opinion'));
            }
        },
        submitVote: async (_, args, {
            Crypto,
            Donation,
            BulletPoint,
            Resource,
            Rhetoric,
            currentUser
        }) => {
            // Args not destructed for easier passage to helper functions
            // args destructed = {onModel: String!, documentID: ID!, amount: Float!, upVote: Boolean!}
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (args.onModel !== 'BulletPoint' && args.onModel !== 'Resource' && args.onModel !== 'Rhetoric') throw new UserInputError('invalid-type');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                const cryptoDoc = await Crypto.findOne({
                    ticker: 'BTC'
                })
                if (cryptoDoc.valueUSD * Number(args.amount) < 1) throw new UserInputError('donation-minimum');

                //Create Invoice and Donation
                args.votingDonation = true;
                var applicableDocument = {};
                (args.onModel === 'BulletPoint') ? applicableDocument = await BulletPoint.findOne({
                        _id: args.documentID
                    }): (args.onModel === 'Resource') ? applicableDocument = await Resource.findOne({
                        _id: args.documentID
                    }) :
                    applicableDocument = await Rhetoric.findOne({
                        _id: args.documentID
                    });
                const newInvoice = await createInvoice(args, currentUser, args.onModel);
                const newDonation = await createDonation(args, applicableDocument, newInvoice, Donation, currentUser);

                //Check every 5 minutes to see if the invoice has been paid
                var invoiceInterval;
                invoiceInterval = setInterval(invoicePaid(newInvoice, newDonation, invoiceInterval, args, applicableDocument), 300000);

                //Return invoice URL
                return newInvoice.url;
            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unknown error occurred while submitting this vote'));
            }
        },
        approveOpinion: async (_, {
            _id,
            approved,
            approvalCommentary
        }, {
            Opinion,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (!currentUser.admin) throw new ForbiddenError('admin');

                //Update Opinion document
                const opinion = await Opinion.findOne({
                    _id
                });
                opinion.approved = approved;
                opinion.approvedBy = currentUser.username;
                opinion.approvalCommentary = approvalCommentary;
                opinion.dateApproved = new Date();
                opinion.save()

                return true;

            } catch (err) {
                throw new ApolloError(parseError(err.message,'An unknown error occurred while approving this opinion'));
            }

        }
    }
}