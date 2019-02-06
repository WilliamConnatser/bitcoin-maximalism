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
                const user = await User.findOne({
                        username: currentUser.username
                    },null, {
                        $fields: {
                            password: false
                        }
                    })
                    .populate({
                        path: 'donations',
                        model: 'Donation'
                    })
                    .populate({
                        path: 'opinions',
                        model: 'Opinion',
                        populate: {
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User'
                            }
                        }
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User'
                        }
                    });

                return user;

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
                        model: 'BulletPoint',
                        populate: {
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                options: {
                                    fields: {
                                        _id: true,
                                        username: true,
                                        accruedDonations: true
                                    }
                                }
                            }
                        }
                    })
                    .populate({
                        path: 'resources',
                        model: 'Resource',
                        populate: {
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                options: {
                                    fields: {
                                        _id: true,
                                        username: true,
                                        accruedDonations: true
                                    }
                                }
                            }
                        }
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            options: {
                                fields: {
                                    _id: true,
                                    username: true,
                                    accruedDonations: true
                                }
                            }
                        }
                    });

                return rhetoric;
            } catch (err) {
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
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            options: {
                                fields: {
                                    _id: true,
                                    username: true,
                                    accruedDonations: true
                                }
                            }
                        }
                    });

                return rhetoric;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching all rhetoric'));
            }
        },
        docIDSpecificDonation: async (_, {
            _id
        }, {
            Donation,
            currentUser
        }) => {
            try {
                if (!_id) throw new UserInputError('invalid-id');
                //Donation info has to do with financial privacy, so only the user should be able to access their own donations.
                if (!currentUser) throw new AuthenticationError('log-in');
                const donation = await Donation.findOne({
                    _id
                });
                if (!donation) throw new UserInputError('invalid-id');
                if (donation.createdBy.toString() !== currentUser._id) throw new AuthenticationError('unauthorized');

                else return donation;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while fetching this donation'));
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
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                options: {
                                    fields: {
                                        _id: true,
                                        username: true,
                                        accruedDonations: true
                                    }
                                }
                            }
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            options: {
                                fields: {
                                    _id: true,
                                    username: true,
                                    accruedDonations: true
                                }
                            }
                        })
                        .sort({
                            dateCreated: sortDirection
                        })
                        .limit(index + 10);

                } else if (sortType === 'votes') {

                    function calculateVotes(voteArray) {
                        var cumulativeVote = 0;
                        voteArray.forEach(vote => {
                            if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
                            else cumulativeVote -= vote.createdBy.accruedDonations;
                        });
                        return cumulativeVote;
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
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                options: {
                                    fields: {
                                        _id: true,
                                        username: true,
                                        accruedDonations: true
                                    }
                                }
                            }
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            options: {
                                fields: {
                                    _id: true,
                                    username: true,
                                    accruedDonations: true
                                }
                            }
                        });

                    if (sortDirection === 'descending') {
                        opinions = await sortArrayByVoteDescending(opinions)
                    } else {
                        opinions = await sortArrayByVoteAscending(opinions)
                    }

                    opinions = opinions.slice(0, (index + 10));
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
        },
        docIDSpecificVotes: async (_, {
            _id,
            onModel
        }, {
            Vote
        }) => {
            try {
                return await Vote.find({
                    documentID: _id,
                    onModel
                }).populate({
                    path: 'createdBy',
                    model: 'User',
                    options: {
                        fields: {
                            _id: true,
                            username: true,
                            accruedDonations: true
                        }
                    }
                });
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unkown error occurred while counting this document\'s opinions'));
            }
        }
    },
    Mutation: {
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
                if (!user) throw new UserInputError('user-not-found');
                if (user.emailVerified) throw new UserInputError('already-verified');

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
                if (!user) throw new UserInputError('user-not-found');
                if (!user.emailVerified) throw new AuthenticationError('verify-email')

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
                if (!user.emailVerified) throw new AuthenticationError('verify-email')

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
            password,
            ref
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

                var referredBy = null;
                if (ref) {
                    referredBy = await User.findOne({
                        _id: ref
                    });
                    if (!referredBy) throw new UserInputError("invalid-referral");
                }

                //Construct the user object to be inserted
                var userObject = {
                    username,
                    email,
                    password,
                    referredBy: ref
                }
                //If this is the first user registering, then make them an Admin
                if (await User.findOne() == undefined) {
                    userObject.admin = true;
                }
                //Save new user to the database
                const newUser = await new User(userObject).save();

                //Save the new user's ID in the referrer's referrals array
                if (ref) {
                    referredBy.referrals.push(newUser._id);
                    referredBy.save();
                }

                //Construct and send email verification
                sendRegistrationEmail(newUser);

                return true;
            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating your user'));
            }
        },
        submitOpinion: async (_, {
            onModel,
            documentID,
            opinion
        }, {
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
                if (onModel !== 'BulletPoint' && onModel !== 'Resource' && onModel !== 'Rhetoric') throw new UserInputError('invalid-type');
                //TODO: Write helper function: ValidateOpinion(opinion)


                //Create Invoice, Donation document, and Opinion document
                var applicableDocument = {};
                (onModel === 'BulletPoint') ? applicableDocument = await BulletPoint.findOne({
                        _id: documentID
                    }): (onModel === 'Resource') ? applicableDocument = await Resource.findOne({
                        _id: documentID
                    }) :
                    applicableDocument = await Rhetoric.findOne({
                        _id: documentID
                    });

                var userDocument = await User.findOne({
                    _id: currentUser._id
                });

                if (!applicableDocument) throw new UserInputError('invalid-id');
                if (!userDocument) throw new UserInputError('user-not-found');

                var opinionObject = {
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

                if (onModel !== 'Rhetoric') {
                    opinionObject.slug = applicableDocument.slug;
                }

                //Save the Opinion document and the User document
                const newOpinion = await new Opinion(opinionObject).save();
                userDocument.opinions.push(newOpinion);
                userDocument.save();

                return currentUser.accruedDonations;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this opinion'));
            }
        },
        submitVote: async (_, {
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
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (onModel !== 'BulletPoint' && onModel !== 'Resource' && onModel !== 'Rhetoric' && onModel !== 'Opinion') throw new UserInputError('invalid-type');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');

                //Get document being voted on & the user document
                var applicableDocument = {};
                (onModel === 'BulletPoint') ? applicableDocument = await BulletPoint.findOne({
                    _id: documentID
                }): (onModel === 'Resource') ? applicableDocument = await Resource.findOne({
                    _id: documentID
                }) : (onModel === 'Rhetoric') ? applicableDocument = await Rhetoric.findOne({
                    _id: documentID
                }) : applicableDocument = await Opinion.findOne({
                    _id: documentID
                });

                var userDocument = await User.findOne({
                    _id: currentUser._id
                });

                if (!applicableDocument) throw new UserInputError('invalid-document');
                if (!userDocument) throw new UserInputError('user-not-found');

                //See if the user has already voted for this document.
                var oldVote = await Vote.findOne({
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

                    var voteObject = {
                        _id: require('mongodb').ObjectID(),
                        dateCreated: new Date(),
                        dateUpdated: new Date(),
                        createdBy: currentUser._id,
                        metaSlug: applicableDocument.metaSlug,
                        onModel,
                        documentID,
                        upVote
                    }
                    if (applicableDocument.__typename !== 'Rhetoric') {
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this vote'));
            }
        },
        submitDonation: async (_, {
            amount
        }, {
            Crypto,
            User,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                const bitcoinValue = await Crypto.findOne({
                    ticker: 'BTC'
                }).valueUSD;
                validateDonationAmount(amount, bitcoinValue);

                const userDocument = await User.findOne({
                    _id: currentUser._id
                });
                if (!userDocument) throw new UserInputError('user-not-found');

                const newInvoice = await createInvoice(amount, currentUser);
                const newDonation = await createDonation(amount, newInvoice, currentUser, userDocument);

                userDocument.donations.push(newDonation._id);
                userDocument.save();

                //Check every 5 minutes to see if the invoice has been paid
                var invoiceInterval;
                invoiceInterval = setInterval(function () {
                    invoicePaid(newInvoice, newDonation, invoiceInterval, userDocument);
                }, 30000);

                //Return donation ID
                return newDonation._id;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while approving this opinion'));
            }
        }
    }
}

/*
    Some of this logic will be used to attribute donations to accounts Saved for l8tr
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

            */


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
        */