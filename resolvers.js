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

//Resolver helpers
const {
    createToken,
    createInvoice,
    createOpinion,
    createDonation,
    validateDonationAmount,
    invoicePaid,
    sendPasswordResetEmail,
    sendRegistrationEmail,
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
                    })
                    .populate({
                        path: 'donations',
                        model: 'Donation'
                    })
                    .populate({
                        path: 'certificates',
                        model: 'Certificate'
                    })
                    .populate({
                        path: 'opinions',
                        model: 'Opinion'
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote'
                    })
                    .populate({
                        path: 'edits',
                        model: 'Edit'
                    })
                    .populate({
                        path: 'bulletPoints',
                        model: 'BulletPoint'
                    })
                    .populate({
                        path: 'resources',
                        model: 'Resource'
                    })
                    .populate({
                        path: 'rhetoric',
                        model: 'Rhetoric'
                    });

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this user'));
            }
        },
        cryptoValue: async (_, {
            ticker
        }, {
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
            // args destructed = { metaSlug: String, slug: String }
            try {
                //Only return active and approved arguments
                args.approved = true;
                args.active = true;

                const rhetoric = await Rhetoric
                    .findOne(args)
                    .populate({
                        path: 'bulletPoints',
                        model: 'BulletPoint'
                    })
                    .populate({
                        path: 'bulletPoints.votes',
                        model: 'Vote'
                    })
                    .populate({
                        path: 'bulletPoints.votes.createdBy',
                        model: 'User'
                    })
                    .populate({
                        path: 'resources',
                        model: 'Resource'
                    })
                    .populate({
                        path: 'resources.votes',
                        model: 'Vote'
                    })
                    .populate({
                        path: 'resources.votes.createdBy',
                        model: 'User'
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote'
                    })
                    .populate({
                        path: 'votes.createdBy',
                        model: 'User'
                    });

                return rhetoric;
            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching argument-specific rhetoric'));
            }
        },
        allRhetoric: async (_, {
            metaSlug
        }, {
            Rhetoric
        }) => {
            try {
                const rhetoric = await Rhetoric
                    .find({
                        metaSlug,
                        approved: true,
                        active: true
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote'
                    })
                    .populate({
                        path: 'votes.createdBy',
                        model: 'User'
                    });

                return rhetoric;
            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching all rhetoric'));
            }
        },
        argumentSpecificDonations: async (_, args, {
            Donation
        }) => {
            // args not destructed to make it easier to pass into Query
            // args destructed = { metaSlug: String, slug: String }
            try {
                const donations = await Donation.find(args).sort({
                    value: 'desc'
                });
                return donations;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching these argument-specific donations'));
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this donation by ID'));
            }
        },
        argumentSpecificAmountDonated: async (_, args, {
            Donation
        }) => {
            // args not destructed to make it easier to pass into Query
            // args destructed = { metaSlug: String, slug: String }
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching the total amount donated for this argument'));
            }
        },
        docIDSpecificAmountDonated: async (_, args, {
            Donation
        }) => {
            // args not destructed to make it easier to pass into Query
            // args destructed = { metaSlug: String, slug: String, onModel: String, documentID: ID }
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching the total amount donated for this document'));
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this opinion by donation ID'));
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this rhetoric by donation ID'));
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this bulletpoint by donation ID'));
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this resource by donation ID'));
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching unapproved opinions'));
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching unapproved opinions'));
            }
        },
        docIDSpecificOpinions: async (_, {
            _id,
            onModel,
            sortType,
            sortDirection,
            index
        }, {
            Opinion
        }) => {
            // the amount of opinions returned from this response is limited to save resources and bandwidth
            // index then used to load more comments if the user wants to view more
            try {

                if (index < 0) throw new UserInputError('invalid-sort-index');
                if (sortDirection) {
                    if (sortDirection !== 'ascending' && sortDirection !== 'descending') {
                        throw new UserInputError('invalid-sort-order');
                    }
                }

                if (sortType === 'dateCreated') {
                    var opinions = await Opinion.find({
                            approved: true,
                            documentID: _id,
                            onModel
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote'
                        })
                        .populate({
                            path: 'votes.createdBy',
                            model: 'User'
                        })
                        .sort({
                            [sort]: sortDirection
                        })
                        .limit(index + 10);
                } else if (sortType === 'votes') {


                    function calculateVotes(voteArray) {
                        var upVotes = 0;
                        var downVotes = 0
                        voteArray.forEach(vote => {
                            if (vote.upVotes) upVotes += vote.createdBy.accruedDonations;
                            else downVotes += vote.createdBy.accruedDonations;
                        });

                        return upVotes + downVotes;
                    }

                    function sortArrayByVoteDescending(rhetoricArray) {
                        return rhetoricArray.sort((a, b) => {
                            return calculateVotes(b.votes) - calculateVotes(a.votes);
                        });
                    }

                    function sortArrayByVoteAscending(rhetoricArray) {
                        return rhetoricArray.sort((a, b) => {
                            return calculateVotes(a.votes) - calculateVotes(b.votes);
                        });
                    }

                    var opinions = await Opinion.find({
                            approved: true,
                            documentID: _id,
                            onModel
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote'
                        })
                        .populate({
                            path: 'votes.createdBy',
                            model: 'User'
                        });

                    if (sortDirection === 'descending') {
                        opinions = await sortArrayByVoteDescending(opinions).slice(0, index + 10);
                    } else {
                        opinions = await sortArrayByVoteAscending(opinions).slice(0, index + 10);
                    }

                } else if (sortType === 'random') {
                    var opinions = await Opinion.find({
                            approved: true,
                            documentID: _id,
                            onModel
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote'
                        })
                        .populate({
                            path: 'votes.createdBy',
                            model: 'User'
                        })
                        .limit(index + 10);

                } else {
                    throw new UserInputError('invalid-sort-type');
                }

                return opinions;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while querying for opinions'));
            }
        },
        docIDSpecificOpinionCount: async (_, {
            _id,
            onModel
        }, {
            Opinion
        }) => {
            try {
                return await Opinion.find({
                    approved: true,
                    documentID: _id,
                    onModel
                }).countDocuments();
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while counting this document\'s opinions'));
            }
        }
    },
    Mutation: {
        /* Inactive for now
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
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while creating this BulletPoint'));
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
                throw new ApolloError(parseError(err.message, 'An unknown error has occurred!'));
            }
        },
        */
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
                    token: createToken(user, process.env.SECRET, '1hr')
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
                var userObjectFromToken = {}
                //Validation
                const userObject = await jwt.verify(token, process.env.SECRET, function (err, userObject) {
                    if (err) throw new AuthenticationError('invalid-token');
                    userObjectFromToken = userObject
                });
                if (userObjectFromToken.emailVerified) throw new UserInputError("already-verified");

                //Update User document
                var user = await User.findOne({
                    username: userObjectFromToken.username
                });
                if (!user) throw new AuthenticationError('user-not-found');
                user.emailVerified = true;
                user.save();

                //Return token 
                return {
                    token: createToken(user, process.env.SECRET, "1hr")
                }
            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while verifying your email'));
            }
        },
        resendRegistrationEmail: async (_, {
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while re-sending your verification email'));
            }
        },
        startPasswordReset: async (_, {
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

                //Construct and send email verification
                sendPasswordResetEmail(user);
                return true;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while sending your password reset email'));
            }
        },
        verifyPasswordReset: async (_, {
            token
        }, {
            User
        }) => {
            try {

                //Validation
                try {
                    var userObject = await jwt.verify(token, process.env.SECRET)
                } catch (err) {
                    throw new AuthenticationError('invalid-token');
                }

                //Update User document
                var user = await User.findOne({
                    username: userObject.username
                });
                if (!user) throw new AuthenticationError('user-not-found');

                //Return token 
                return {
                    token: createToken(user, process.env.SECRET, "1hr")
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while verifying your email'));
            }
        },
        resendPasswordEmail: async (_, {
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

                //Construct and send email verification
                sendPasswordResetEmail(user);

                return true;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while re-sending your password reset email'));
            }
        },
        resetPassword: async (_, {
            token,
            newPassword1,
            newPassword2
        }, {
            User
        }) => {
            try {

                //Validation
                try {
                    var userObject = await jwt.verify(token, process.env.SECRET)
                } catch (err) {
                    throw new AuthenticationError('invalid-token');
                }

                //Update User document
                var user = await User.findOne({
                    username: userObject.username
                });
                if (!user) throw new AuthenticationError('user-not-found');

                if (newPassword1 === newPassword2) {
                    user.password = newPassword1;
                    await user.save();
                } else {
                    throw new UserInputError('un-matching-passwords');
                }

                //Return token 
                return {
                    token: createToken(user, process.env.SECRET, "1hr")
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while updating your password'));
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
                sendRegistrationEmail(newUser);

                return true;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating your user'));
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
                if (args.onModel !== 'BulletPoint' && args.onModel !== 'Resource') throw new UserInputError('invalid-type');
                const cryptoDoc = await Crypto.findOne({
                    ticker: 'BTC'
                });
                validateDonationAmount(args.amount, cryptoDoc.valueUSD);


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
                invoiceInterval = setInterval(function () {
                    invoicePaid(newInvoice, newDonation, invoiceInterval);
                }, 30000);

                //Return donation ID
                return newDonation._id;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this opinion'));
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
            // args destructed = {onModel: String!, documentID: ID!, amount: String!, upVote: Boolean!}
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (args.onModel !== 'BulletPoint' && args.onModel !== 'Resource' && args.onModel !== 'Rhetoric') throw new UserInputError('invalid-type');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                const cryptoDoc = await Crypto.findOne({
                    ticker: 'BTC'
                })
                validateDonationAmount(args.amount, cryptoDoc.valueUSD);

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
                invoiceInterval = setInterval(function () {
                    invoicePaid(newInvoice, newDonation, invoiceInterval, args, applicableDocument);
                }, 300000);

                //Return donation ID
                return newDonation._id;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this vote'));
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
                opinion.save();

                return true;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while approving this opinion'));
            }

        }
    }
}