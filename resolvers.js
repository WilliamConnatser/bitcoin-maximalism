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
    sortByVote,
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
                        _id: currentUser._id
                    }, '-password')
                    .populate({
                        path: 'donations',
                        model: 'Donation',
                        options: {
                            sort: {
                                'dateCreated': 'descending'
                            }
                        }
                    })
                    .populate({
                        path: 'opinions',
                        model: 'Opinion',
                        populate: {
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        },
                        options: {
                            sort: {
                                'dateCreated': 'descending'
                            }
                        }
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        },
                        options: {
                            sort: {
                                'dateCreated': 'descending'
                            }
                        }
                    })
                    .populate({
                        path: 'resources',
                        model: 'Resource',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        },
                        populate: {
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        },
                        options: {
                            sort: {
                                'dateCreated': 'descending'
                            }
                        }
                    })
                    .populate({
                        path: 'rhetoric',
                        model: 'Rhetoric',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        },
                        populate: {
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        },
                        options: {
                            sort: {
                                'dateCreated': 'descending'
                            }
                        }
                    })
                    .populate({
                        path: 'bulletPoints',
                        model: 'BulletPoint',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        },
                        populate: {
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        },
                        options: {
                            sort: {
                                'dateCreated': 'descending'
                            }
                        }
                    })

                return user;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching this user'));
            }
        },
        allUsernames: async (_, args, {
            User
        }) => {
            try {
                const users = await User.find({}, 'username');

                return users.filter(user => user.username !== 'Administrator');

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all users'));
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching the value of this cryptocurrency'));
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
                        match: {
                            approved: true,
                            active: true
                        },
                        populate: {
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        }
                    })
                    .populate({
                        path: 'resources',
                        model: 'Resource',
                        match: {
                            approved: true,
                            active: true
                        },
                        populate: {
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        }
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        }
                    });

                return rhetoric;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching argument-specific rhetoric'));
            }
        },
        allRhetoric: async (_, {
            metaSlug
        }, {
            Rhetoric
        }) => {
            try {

                //Default query if no Meta Slug is provided
                const queryObject = {
                    approved: true,
                    active: true
                }

                //Query if Meta Slug is provided
                if (metaSlug) {
                    if (metaSlug !== 'protagonistic' && metaSlug !== 'antagonistic') {
                        throw new UserInputError('invalid-variable');
                    } else {
                        queryObject.metaSlug = metaSlug;
                    }
                }

                //Use query object to get an array of Rhetoric documents
                const rhetoric = await Rhetoric
                    .find(queryObject)
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        }
                    });

                return rhetoric;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all rhetoric'));
            }
        },
        allProjects: async (_, {
            metaSlug
        }, {
            Project
        }) => {
            try {

                //Default query if no Meta Slug is provided
                const queryObject = {
                    approved: true,
                    active: true
                }

                //Query if Meta Slug is provided
                if (metaSlug) {
                    if (metaSlug !== 'protagonistic' && metaSlug !== 'antagonistic') {
                        throw new UserInputError('invalid-variable');
                    } else {
                        queryObject.metaSlug = metaSlug;
                    }
                }

                //Use query object to get an array of Rhetoric documents
                const projects = await Project
                    .find(queryObject)
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        }
                    });

                return projects;
            } catch (err) {
                console.log(allProjects)
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all projects'));
            }
        },
        allSlugs: async (_, args, {
            Rhetoric
        }) => {
            try {
                const rhetoric = await Rhetoric.find({
                    approved: true,
                    active: true
                });
                const protagonistic = await rhetoric.filter(arg => arg.metaSlug === 'protagonistic' && arg.approved === true).map(arg => arg.slug);
                const antagonistic = await rhetoric.filter(arg => arg.metaSlug === 'antagonistic' && arg.approved === true).map(arg => arg.slug);

                return {
                    protagonistic,
                    antagonistic
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching all users'));
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
                    })
                    .populate({
                        path: 'createdBy',
                        model: 'User',
                        select: '_id username accruedDonations'
                    })
                    .populate({
                        path: 'createdFor',
                        model: 'User',
                        select: '_id username accruedDonations'
                    });

                if (!donation) throw new UserInputError('invalid-id');
                if (donation.createdBy._id.toString() !== currentUser._id &&
                    donation.createdFor._id.toString() !== currentUser._id) throw new AuthenticationError('unauthorized');

                else return donation;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching this donation'));
            }
        },
        checkDonation: async (_, {
            _id
        }, {
            Donation,
            User,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');

                const userDocument = await User.findOne({
                    _id: currentUser._id
                });
                if (!userDocument) throw new UserInputError('user-not-found');

                const donationDocument = await Donation.findOne({
                    _id
                });
                if (!donationDocument) throw new UserInputError('user-not-found');

                if (donationDocument.paid) {
                    return true;
                } else {
                    const donationPaid = await invoicePaid(donationDocument, userDocument);
                    return donationPaid;
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while checking this donation'));
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

                let opinions = [];

                if (sortType === 'dateCreated') {

                    opinions = await Opinion.find({
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
                                select: '_id username accruedDonations'
                            }
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .sort({
                            dateCreated: sortDirection
                        })
                        .limit(index + 10);

                } else if (sortType === 'votes') {

                    function calculateVotes(voteArray) {
                        let cumulativeVote = 0;
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

                    opinions = await Opinion.find({
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
                                select: '_id username accruedDonations'
                            }
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while querying for opinions'));
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while counting this document\'s opinions'));
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
                    select: '_id username accruedDonations'
                });
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while counting this document\'s opinions'));
            }
        },
        topArguments: async (_, {
            onModel,
            descending,
            limit
        }, {
            Rhetoric
        }) => {
            try {
                if (onModel !== 'Opinion' && onModel !== 'Vote') throw new UserInputError('invalid-model');
                if (limit < 1) throw new UserInputError('invalid-limit');

                if (onModel === 'Opinion') {
                    let rhetoric = await Rhetoric.find({
                            approved: true,
                            active: true
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        })

                    return await rhetoric.sort((a, b) => {
                        if (descending) {
                            return b.opinions.length - a.opinions.length;
                        } else {
                            return a.opinions.length - b.opinions.length;
                        }
                    }).slice(0, limit);

                } else {
                    let rhetoric = await Rhetoric.find({
                            approved: true,
                            active: true
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        });

                    return await sortByVote(rhetoric, descending).slice(0, limit);
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these arguments'));
            }
        },
        topBulletPoints: async (_, {
            onModel,
            descending,
            limit
        }, {
            BulletPoint
        }) => {
            try {
                if (onModel !== 'Opinion' && onModel !== 'Vote') throw new UserInputError('invalid-model');
                if (limit < 1) throw new UserInputError('invalid-limit');

                if (onModel === 'Opinion') {
                    const bulletPoints = await BulletPoint.find({
                            approved: true,
                            active: true
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        });

                    return await bulletPoints.sort((a, b) => {
                        if (descending) {
                            return b.opinions.length - a.opinions.length;
                        } else {
                            return a.opinions.length - b.opinions.length;
                        }
                    }).slice(0, (limit));

                } else {
                    const bulletPoints = await BulletPoint.find({
                            approved: true,
                            active: true
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        });

                    return await sortByVote(bulletPoints, descending).slice(0, limit);
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these bulletpoints'));
            }
        },
        topResources: async (_, {
            onModel,
            descending,
            limit
        }, {
            Resource
        }) => {
            try {
                if (onModel !== 'Opinion' && onModel !== 'Vote') throw new UserInputError('invalid-model');
                if (limit < 1) throw new UserInputError('invalid-limit');

                if (onModel === 'Opinion') {
                    const resources = await Resource.find({
                            approved: true,
                            active: true
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        });

                    return await resources.sort((a, b) => {
                        if (descending) {
                            return b.opinions.length - a.opinions.length;
                        } else {
                            return a.opinions.length - b.opinions.length;
                        }
                    }).slice(0, (limit));

                } else {
                    const resources = await Resource.find({
                            approved: true,
                            active: true
                        })
                        .populate({
                            path: 'votes',
                            model: 'Vote',
                            populate: {
                                path: 'createdBy',
                                model: 'User',
                                select: '_id username accruedDonations'
                            }
                        });

                    return await sortByVote(resources, descending).slice(0, limit);
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these resources'));
            }
        },
        topOpinions: async (_, {
            descending,
            limit
        }, {
            Opinion
        }) => {
            try {
                if (limit < 1) throw new UserInputError('invalid-limit');

                const opinions = await Opinion.find({
                        approved: true
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        }
                    })
                    .populate({
                        path: 'createdBy',
                        model: 'User',
                        select: '_id username accruedDonations'
                    });

                return await sortByVote(opinions, descending).slice(0, limit);

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these arguments'));
            }
        },
        recentOpinions: async (_, {
            limit
        }, {
            Opinion
        }) => {
            try {
                if (limit < 1) throw new UserInputError('invalid-limit');

                const opinions = await Opinion.find({
                        approved: true
                    })
                    .populate({
                        path: 'votes',
                        model: 'Vote',
                        populate: {
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        }
                    })
                    .populate({
                        path: 'createdBy',
                        model: 'User',
                        select: '_id username accruedDonations'
                    })
                    .sort({
                        dateCreated: 'descending'
                    })
                    .limit(limit);

                return opinions;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these opinions'));
            }
        },
        mostReferrals: async (_, {
            limit
        }, {
            User
        }) => {
            try {
                if (limit < 1) throw new UserInputError('invalid-limit');

                const users = await User.find({}, '_id username accruedDonations referrals');
                const processedUsers = [];

                users.forEach(user => {
                    processedUsers.push({
                        _id: user._id,
                        username: user.username,
                        referralAmount: user.referrals.length
                    });
                });

                return await processedUsers.sort((a, b) => {
                    return b.referralAmount - a.referralAmount;
                }).filter(user => user.username !== 'Administrator').slice(0, limit);

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these users'));
            }
        },
        mostReferralInfluence: async (_, {
            limit
        }, {
            User
        }) => {
            try {
                if (limit < 1) throw new UserInputError('invalid-limit');

                const users = await User.find({}, '_id username referrals')
                    .populate({
                        path: 'referrals',
                        model: 'User',
                        select: '_id',
                        populate: {
                            path: 'donations',
                            model: 'Donation'
                        }
                    });

                const processedUsers = [];

                users.forEach(user => {
                    user.referralInfluence = 0;
                    user.referrals.forEach(referredUser => {
                        referredUser.donations.forEach(donation => {
                            if (donation.paid) {
                                user.referralInfluence += donation.amount * 0.1;
                            }
                        });
                    });

                    processedUsers.push({
                        _id: user._id,
                        username: user.username,
                        referralInfluence: user.referralInfluence
                    });
                });

                return processedUsers.sort((a, b) => {
                    return b.referralInfluence - a.referralInfluence;
                }).filter(user => user.username !== 'Administrator').slice(0, limit);

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these users'));
            }
        },
        mostInfluentialUsers: async (_, {
            limit
        }, {
            User
        }) => {
            try {
                if (limit < 1) throw new UserInputError('invalid-limit');

                const users = await User.find({}, '_id username accruedDonations');

                return await users.sort((a, b) => {
                    return b.accruedDonations - a.accruedDonations;
                }).filter(user => user.username !== 'Administrator').slice(0, limit);

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these users'));
            }
        },
        unapprovedRhetoric: async (_, {
            _id
        }, {
            Rhetoric
        }) => {
            try {

                //Queried for a single document
                if (_id !== undefined) {

                    const rhetoric = await Rhetoric.findOne({
                            _id
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    if (!rhetoric) throw new UserInputError('invalid-id');

                    return [rhetoric];
                }

                //Queried for all documents
                else {

                    const rhetoric = await Rhetoric.find({
                            active: true,
                            approved: false
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    return rhetoric;
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved arguments'));
            }
        },
        unapprovedBulletPoints: async (_, {
            _id
        }, {
            BulletPoint
        }) => {
            try {

                //Queried for a single document
                if (_id !== undefined) {

                    const bulletPoint = await BulletPoint.findOne({
                            _id
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    if (!bulletPoint) throw new UserInputError('invalid-id');

                    return [bulletPoint];
                }

                //Queried for all documents
                else {

                    const bulletPoint = await BulletPoint.find({
                            approved: false,
                            active: true
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    return bulletPoint;
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved bulletpoints'));
            }
        },
        unapprovedResources: async (_, {
            _id
        }, {
            Resource
        }) => {
            try {

                //Queried for a single document
                if (_id !== undefined) {

                    const resource = await Resource.findOne({
                            _id
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    if (!resource) throw new UserInputError('invalid-id');

                    return [resource];
                }

                //Queried for all documents
                else {

                    const resource = await Resource.find({
                            approved: false,
                            active: true
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    return resource;
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved resources'));
            }
        },
        unapprovedProjects: async (_, {
            _id
        }, {
            Project
        }) => {
            try {

                //Queried for a single document
                if (_id !== undefined) {

                    const project = await Project.findOne({
                            _id
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    if (!project) throw new UserInputError('invalid-id');

                    return [project];
                }

                //Queried for all documents
                else {

                    const project = await Project.find({
                            approved: false,
                            active: true
                        })
                        .populate({
                            path: 'createdBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        })
                        .populate({
                            path: 'approvedBy',
                            model: 'User',
                            select: '_id username accruedDonations'
                        });

                    return project;
                }

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching these unapproved projects'));
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
                //Construct regex for case-insensitive Mongoose query
                const emailRegEx = new RegExp(email.replace('.', '\.'), 'i');

                //Grab the user document
                const user = await User.findOne({
                    email: emailRegEx
                });

                //Validation
                if (!user) {
                    throw new AuthenticationError("user-not-found");
                }
                if (!user.emailVerified) throw new ForbiddenError('verify-email');
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    throw new AuthenticationError("invalid-password");
                }

                //Return login token
                return {
                    token: createToken(user, process.env.SECRET, '3hr')
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while signing in'));
            }
        },
        verifyEmail: async (_, {
            token
        }, {
            User
        }) => {
            try {
                let userObjectFromToken = {};
                //Validation
                await jwt.verify(token, process.env.SECRET, function (err, userObject) {
                    if (err) throw new AuthenticationError('invalid-token');
                    userObjectFromToken = userObject
                });
                if (userObjectFromToken.emailVerified) throw new UserInputError("already-verified");

                //Update User document
                const user = await User.findOne({
                    username: userObjectFromToken.username
                });
                if (!user) throw new AuthenticationError('user-not-found');
                user.emailVerified = true;
                user.save();

                //Return token 
                return {
                    token: createToken(user, process.env.SECRET, "3hr")
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while verifying your email'));
            }
        },
        resendRegistrationEmail: async (_, {
            email
        }, {
            User
        }) => {
            try {
                //Construct regex for case-insensitive Mongoose query
                const emailRegEx = new RegExp(email.replace('.', '\.'), 'i');

                //Grab the user document
                const user = await User.findOne({
                    email: emailRegEx
                });

                //Validation
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
                //Construct regex for case-insensitive Mongoose query
                const emailRegEx = new RegExp(email.replace('.', '\.'), 'i');

                //Grab the user document
                const user = await User.findOne({
                    email: emailRegEx
                });

                //Validation
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
                const user = await User.findOne({
                    username: userObject.username
                });
                if (!user) throw new AuthenticationError('user-not-found');
                if (!user.emailVerified) throw new AuthenticationError('verify-email')

                //Return token 
                return {
                    token: createToken(user, process.env.SECRET, "3hr")
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while verifying your email'));
            }
        },
        resendPasswordEmail: async (_, {
            email
        }, {
            User
        }) => {
            try {
                //Construct regex for case-insensitive Mongoose query
                const emailRegEx = new RegExp(email.replace('.', '\.'), 'i');

                //Grab the user document
                const user = await User.findOne({
                    email: emailRegEx
                });

                //Validation
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
                let user = await User.findOne({
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
                    token: createToken(user, process.env.SECRET, "3hr")
                }
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while updating your password'));
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

                //Construct regex for case-insensitive Mongoose query
                const usernameRegEx = new RegExp(username.replace('.', '\.'), 'i');
                const userInUse = await User.findOne({
                    username: usernameRegEx
                });
                if (userInUse) throw new UserInputError("username-taken");
                if (username.length > 25) throw new UserInputError("username-length");

                //Construct regex for case-insensitive Mongoose query
                const emailRegEx = new RegExp(email.replace('.', '\.'), 'i');
                const emailInUse = await User.findOne({
                    email: emailRegEx
                });
                if (emailInUse) throw new UserInputError("email-taken");

                let referredBy = null;
                if (ref) {
                    referredBy = await User.findOne({
                        _id: ref
                    });
                    if (!referredBy) throw new UserInputError("invalid-referral");
                }

                //Construct the user object to be inserted
                const userObject = {
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
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating your user'));
            }
        },
        submitOpinion: async (_, {
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
        },
        submitDonation: async (_, {
            amount,
            userID
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

                const currentUserDocument = await User.findOne({
                    _id: currentUser._id
                });
                if (!currentUserDocument) throw new UserInputError('user-not-found');

                var otherUserDocument;
                if (currentUser._id === userID) {
                    otherUserDocument = currentUserDocument;
                } else {
                    otherUserDocument = await User.findOne({
                        _id: userID
                    });
                }
                if (!otherUserDocument) throw new UserInputError('user-not-found');

                const newInvoice = await createInvoice(amount, currentUser);
                const newDonation = await createDonation(amount, newInvoice, currentUser, currentUserDocument, otherUserDocument);

                currentUserDocument.donations.push(newDonation._id);
                currentUserDocument.save();

                if (currentUser._id !== userID) {
                    otherUserDocument.donations.push(newDonation._id);
                    otherUserDocument.save();
                }

                //Return donation ID
                return newDonation._id;
            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while approving this opinion'));
            }
        },
        submitBulletPoint: async (_, {
            metaSlug,
            slug,
            content
        }, {
            Rhetoric,
            User,
            BulletPoint,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (content.length > 1150) throw new UserInputError('invalid-bulletpoint');
                if (content.trim() === "") throw new UserInputError('invalid-bulletpoint');
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
                if (await Rhetoric.findOne({
                        slug,
                        approved: true,
                        active: true
                    }) === null) throw new UserInputError('invalid-slug');

                const bulletPoint = await BulletPoint.findOne({
                    content
                });
                if (bulletPoint) {
                    throw new UserInputError('already-exists');
                }

                const user = await User.findOne({
                    _id: currentUser._id
                });
                if (!user) {
                    throw new UserInputError('user-not-found');
                }

                //Create BulletPoint document
                let _id = require('mongodb').ObjectID();
                const newBulletPoint = await new BulletPoint({
                    _id,
                    metaSlug,
                    slug,
                    content,
                    createdBy: user._id
                }).save();

                user.bulletPoints.push(newBulletPoint._id)
                user.save();

                return _id;

            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this BulletPoint'));
            }
        },
        submitEditBulletPoint: async (_, {
            documentID,
            metaSlug,
            slug,
            content
        }, {
            Rhetoric,
            BulletPoint,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (content.length > 1150) throw new UserInputError('invalid-bulletpoint');
                if (content.trim() === "") throw new UserInputError('invalid-bulletpoint');
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
                if (await Rhetoric.findOne({
                        slug,
                        approved: true,
                        active: true
                    }) === null) throw new UserInputError('invalid-slug');

                const bulletPoint = await BulletPoint.findOne({
                    _id: documentID
                });
                if (!bulletPoint) throw new UserInputError('invalid-id');
                if (!bulletPoint.createdBy.equals(currentUser._id) && !currentUser.admin) {
                    throw new UserInputError('edit-submission-unauthorized');
                }
                if (bulletPoint.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

                //Update and Save BulletPoint document
                bulletPoint.metaSlug = metaSlug;
                bulletPoint.slug = slug;
                bulletPoint.content = content;
                bulletPoint.save();

                return true;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this BulletPoint'));
            }
        },
        submitResource: async (_, {
            metaSlug,
            slug,
            title,
            media,
            link
        }, {
            Rhetoric,
            User,
            Resource,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (title.length > 280) throw new UserInputError('invalid-title');
                if (title.trim() === "") throw new UserInputError('invalid-title');
                if (media !== "article" && media !== "blog" && media !== "podcast" &&
                    media !== "video" && media !== "whitepaper" && media !== "website") throw new UserInputError('invalid-media');
                if (media.trim() === "") throw new UserInputError('invalid-media');
                if (link.trim() === "") throw new UserInputError('invalid-link');
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
                if (await Rhetoric.findOne({
                        slug,
                        approved: true,
                        active: true
                    }) === null) throw new UserInputError('invalid-slug');
                if (!link.includes('http')) link = 'http://' + link;

                const resource = await Resource.findOne({
                    link
                });
                if (resource) {
                    throw new UserInputError('already-exists');
                }

                const user = await User.findOne({
                    _id: currentUser._id
                });
                if (!user) {
                    throw new UserInputError('user-not-found');
                }

                //Create Resource document
                let _id = require('mongodb').ObjectID();
                const newResource = await new Resource({
                    _id,
                    metaSlug,
                    slug,
                    title,
                    media,
                    link,
                    createdBy: user._id
                }).save();

                user.resources.push(newResource._id)
                user.save();

                return _id;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Resource'));
            }
        },
        submitEditResource: async (_, {
            documentID,
            metaSlug,
            slug,
            title,
            media,
            link
        }, {
            Rhetoric,
            Resource,
            currentUser
        }) => {
            try {
                //Validation & Sanitation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (title.length > 280) throw new UserInputError('invalid-title');
                if (title.trim() === "") throw new UserInputError('invalid-title');
                if (media !== "article" && media !== "blog" && media !== "podcast" &&
                    media !== "video" && media !== "whitepaper" && media !== "website") throw new UserInputError('invalid-media');
                if (media.trim() === "") throw new UserInputError('invalid-media');
                if (link.trim() === "") throw new UserInputError('invalid-link');
                if (link.trim() === "") throw new UserInputError('invalid-link');
                if (!link.includes('http')) link = 'http://' + link;
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
                if (await Rhetoric.findOne({
                        slug,
                        approved: true,
                        active: true
                    }) === null) throw new UserInputError('invalid-slug');

                const resource = await Resource.findOne({
                    _id: documentID
                });
                if (!resource) throw new UserInputError('invalid-id');
                if (!resource.createdBy.equals(currentUser._id) && !currentUser.admin) {
                    throw new UserInputError('edit-submission-unauthorized');
                }
                if (resource.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

                //Edit and Save Resource document
                resource.metaSlug = metaSlug;
                resource.slug = slug;
                resource.title = title;
                resource.media = media;
                resource.link = link;
                resource.save();

                return true;

            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
            }
        },
        submitRhetoric: async (_, {
            metaSlug,
            slug,
            title
        }, {
            User,
            Rhetoric,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (!/^[a-z0-9-]*$/.test(slug)) throw new UserInputError('invalid-slug');
                if (title.length > 80) throw new UserInputError('invalid-title');
                if (title.trim() === "") throw new UserInputError('invalid-title');
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');

                const rhetoric = await Rhetoric.findOne({
                    title
                });
                if (rhetoric) {
                    throw new UserInputError('already-exists');
                }

                const user = await User.findOne({
                    _id: currentUser._id
                });
                if (!user) {
                    throw new UserInputError('user-not-found');
                }

                //Create Rhetoric Document
                let _id = require('mongodb').ObjectID();
                const newRhetoric = await new Rhetoric({
                    _id,
                    metaSlug,
                    slug,
                    title,
                    createdBy: user._id
                }).save();

                user.rhetoric.push(newRhetoric._id);
                user.save();

                return _id;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
            }
        },
        submitEditRhetoric: async (_, {
            documentID,
            metaSlug,
            slug,
            title
        }, {
            Rhetoric,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (!/^[a-z0-9-]*$/.test(slug)) throw new UserInputError('invalid-slug');
                if (title.length > 80) throw new UserInputError('invalid-title');
                if (title.trim() === "") throw new UserInputError('invalid-title');
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');

                let rhetoric = await Rhetoric.findOne({
                    _id: documentID
                });
                if (!rhetoric) throw new UserInputError('invalid-id');
                if (!rhetoric.createdBy.equals(currentUser._id) && !currentUser.admin) {
                    throw new UserInputError('edit-submission-unauthorized');
                }
                if (rhetoric.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

                //Update and Save Rhetoric Document
                rhetoric.metaSlug = metaSlug;
                rhetoric.slug = slug;
                rhetoric.title = title;
                rhetoric.save();

                return true;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
            }
        },
        submitProject: async (_, {
            metaSlug,
            title,
            link,
            description
        }, {
            User,
            Project,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
                if (title.length > 80) throw new UserInputError('invalid-title');
                if (title.trim() === "") throw new UserInputError('invalid-title');
                if (description.length > 1150) throw new UserInputError('invalid-description');
                if (description.trim() === "") throw new UserInputError('invalid-description');
                if (link.trim() === "") throw new UserInputError('invalid-link');
                if (link.trim() === "") throw new UserInputError('invalid-link');
                if (!link.includes('http')) link = 'http://' + link;

                const project = await Project.findOne({
                    title
                });
                if (project) {
                    throw new UserInputError('already-exists');
                }

                const user = await User.findOne({
                    _id: currentUser._id
                });
                if (!user) {
                    throw new UserInputError('user-not-found');
                }

                //Create Rhetoric Document
                let _id = require('mongodb').ObjectID();
                const newProject = await new Project({
                    _id,
                    metaSlug,
                    title,
                    link,
                    description,
                    createdBy: user._id
                }).save();

                user.projects.push(newProject._id);
                user.save();

                return _id;

            } catch (err) {
                console.log(err)
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Project'));
            }
        },
        submitEditProject: async (_, {
            documentID,
            metaSlug,
            title,
            link,
            description
        }, {
            Project,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") throw new UserInputError('invalid-argument-type');
                if (title.length > 80) throw new UserInputError('invalid-title');
                if (title.trim() === "") throw new UserInputError('invalid-title');
                if (description.length > 1150) throw new UserInputError('invalid-description');
                if (description.trim() === "") throw new UserInputError('invalid-description');
                if (link.trim() === "") throw new UserInputError('invalid-link');
                if (link.trim() === "") throw new UserInputError('invalid-link');
                if (!link.includes('http')) link = 'http://' + link;

                let project = await Project.findOne({
                    _id: documentID
                });
                if (!project) throw new UserInputError('invalid-id');
                if (!project.createdBy.equals(currentUser._id) && !currentUser.admin) throw new UserInputError('edit-submission-unauthorized');
                if (project.approved && !currentUser.admin) throw new UserInputError('edit-submission-approved');

                //Update and Save Project Document
                project.metaSlug = metaSlug;
                project.title = title;
                project.link = link;
                project.description = description;
                project.save();

                return true;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Project'));
            }
        },
        setAllegiance: async (_, {
            maximalist
        }, {
            User,
            currentUser
        }) => {
            try {
                if (!currentUser) {
                    throw new Error('You must be logged in to perform this function!')
                }
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');

                const user = await User.findOne({
                    username: currentUser.username
                });

                if (!user) {
                    throw new UserInputError('user-not-found');
                }
                user.maximalist = maximalist;
                user.save();

                return user.maximalist;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
            }
        },
        toggleApproval: async (_, {
            onModel,
            documentID,
            approved,
            approvalCommentary
        }, {
            BulletPoint,
            Resource,
            Rhetoric,
            Project,
            currentUser
        }) => {
            try {
                //Validation
                if (!currentUser) throw new AuthenticationError('log-in');
                if (!currentUser.emailVerified) throw new ForbiddenError('verify-email');
                if (!currentUser.admin) throw new UserInputError('admin');
                if (onModel !== 'BulletPoint' && onModel !== 'Resource' && onModel !== 'Rhetoric' && onModel !== 'Project') throw new UserInputError('invalid-model')

                let applicableDocument = null;

                switch (onModel) {
                    case "BulletPoint":
                        applicableDocument = await BulletPoint.findOne({
                            _id: documentID
                        });
                        break;

                    case "Resource":
                        applicableDocument = await Resource.findOne({
                            _id: documentID
                        });
                        break;

                    case "Rhetoric":
                        applicableDocument = await Rhetoric.findOne({
                            _id: documentID
                        });

                    case "Project":
                        applicableDocument = await Project.findOne({
                            _id: documentID
                        });
                }

                if (!applicableDocument) throw new UserInputError('invalid-id');

                //Update and Save The Applicable Document
                applicableDocument.approved = approved;
                applicableDocument.approvalCommentary = approvalCommentary;
                applicableDocument.dateApproved = new Date();
                applicableDocument.approvedBy = currentUser._id;
                applicableDocument.save();

                return true;

            } catch (err) {
                throw new ApolloError(parseError(err.message, 'An unknown error occurred while submitting this Rhetoric'));
            }
        }
    }
}