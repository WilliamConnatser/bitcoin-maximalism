//Import needed to encrypt password
const bcrypt = require("bcrypt");
//Import needed to generate jsonwebtoken to track logged in user
const jwt = require("jsonwebtoken");

//Import Apollo Errors
const {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError,
} = require('apollo-server');

//BTCPay Server
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));
//Recreate client ... used every time you nee to talk to the BTCPAY Server
const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, {
    merchant: process.env.BTCPAY_MERCHANT
});

const createToken = (user, secret, expiresIn) => {
    const {
        username,
        email,
        admin,
        allegiance
    } = user;

    return jwt.sign({
        username,
        email,
        admin,
        allegiance
    }, secret, {
        expiresIn
    });
};

const createInvoice = async (args, currentUser) => {
    try {
        return await client.create_invoice({
            price: args.amount,
            currency: 'BTC',
            itemDesc: `${args.amount} BTC donation for ${currentUser.username}'s opinion on the ${args.onModel} ${args.documentID}: "${args.opinion}"`,
            buyer: {
                name: currentUser.username,
                email: currentUser.email
            }
        });

    } catch (err) {
        throw new ApolloError('An unknown error occurred while interacting with the BTCPay server.');
    }
}

const createDonation = async (args, applicableDocument, invoice, Donation, currentUser) => {

    try {
        return await new Donation({
            _id: require('mongodb').ObjectID(),
            invoiceID: invoice.id,
            invoiceURL: invoice.url,
            onModel: args.onModel,
            documentID: args.documentID,
            username: currentUser.username,
            amount: args.amount,
            slug: applicableDocument.slug,
            pro: applicableDocument.pro
        }).save();

    } catch (err) {
        throw new ApolloError('An unknown error occurred while creating the donation.');
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
            donation: donation._id
        }).save();

    } catch (err) {
        throw new ApolloError('An unknown error occurred while creating the opinion.');
    }
}

module.exports = {
    Query: {
        getCurrentUser: async (_, args, {
            User,
            currentUser
        }) => {
            if (!currentUser) {
                return null;
            }
            const user = await User.findOne({
                username: currentUser.username
            });
            return user;
        },
        getRhetoricByMetaSlugAndSlug: async (_, args, {
            Rhetoric
        }) => {
            // args destructed = { pro: Boolean, slug: String }

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
        },
        getAllApprovedAndActiveProtagonisticRhetoric: async (_, args, {
            Rhetoric
        }) => {
            const rhetoric = await Rhetoric
                .find({
                    pro: true,
                    approved: true,
                    active: true
                })
                .populate({
                    path: 'bulletPoints',
                    model: 'BulletPoint'
                })
                .populate({
                    path: 'resources',
                    model: 'Resource'
                })
                .sort({
                    dateCreated: 'desc'
                })
            return rhetoric;
        },
        getAllApprovedAndActiveAntagonisticRhetoric: async (_, args, {
            Rhetoric
        }) => {
            const rhetoric = await Rhetoric
                .find({
                    pro: false,
                    approved: true,
                    active: true
                })
                .populate({
                    path: 'bulletPoints',
                    model: 'BulletPoint'
                })
                .populate({
                    path: 'resources',
                    model: 'Resource'
                })
                .sort({
                    dateCreated: 'desc'
                })
            return rhetoric;
        },
        getDonation: async (_, args, {
            Donation
        }) => {
            // args destructed = { pro: Boolean, slug: String }
            const donation = await Donation.find(args).sort({
                value: 'desc'
            });
            return donation;
        },
        getAmountDonatedSlugSpecific: async (_, args, {
            Donation,
            Crypto
        }) => {
            // args destructed = { pro: Boolean, slug: String }
            args.paid = true;
            var aggregateValue = 0;

            await Donation.find(args, function (err, docs) {
                docs.forEach(donation => {
                    aggregateValue += donation.amount;
                });
            });

            return aggregateValue;
        },
        getAmountDonatedModelSpecific: async (_, args, {
            Donation,
            Crypto
        }) => {
            // args destructed = { pro: Boolean, slug: String, onModel: String, documentID: ID }
            args.paid = true;
            var aggregateValue = 0;

            await Donation.find(args, function (err, docs) {
                docs.forEach(donation => {
                    aggregateValue += donation.amount;
                });
            });

            return aggregateValue;
        },
        getUnapprovedOpinions: async (_, args, {
            Donation,
            Opinion,
            currentUser
        }) => {
            // args destructed = { }
            if (!currentUser) throw new AuthenticationError('You must be logged in to do this');
            if (!currentUser.admin) throw new AuthenticationError('You must be an Admin to do this');

            try {

                var unapprovedAndPaidOpinions = [];
                const unapprovedOpinions = await Opinion.find({
                    approved: false,
                    approvedBy: {
                        $exists: false
                    }
                });

                await unapprovedOpinions.forEach(opinion => {
                    const applicableDonation = Donation.findOne({
                        _id: opinion.donation
                    })

                    //TODO delete ! once ability to mark invoices as paid is working
                    if (!applicableDonation.paid) {
                        unapprovedAndPaidOpinions.push(opinion);
                    }
                });

                return unapprovedAndPaidOpinions;

            } catch (err) {
                new ApolloError('An unknown error occurred while retrieving unapproved opinions');
            }
        },
        getUnapprovedEdits: async (_, args, {
            Donation,
            Edit,
            currentUser
        }) => {
            // args destructed = { }
            if (!currentUser) throw new AuthenticationError('You must be logged in to do this');
            if (!currentUser.admin) throw new AuthenticationError('You must be an Admin to do this');

            try {

                var unapprovedAndPaidEdits = [];
                const unapprovedEdits = await Edit.find({
                    approved: false,
                    approvedBy: {
                        $exists: false
                    }
                });

                await unapprovedEdits.forEach(edit => {
                    const applicableDonation = Donation.findOne({
                        _id: edit.donation
                    });

                    //TODO delete ! once ability to mark invoices as paid is working
                    if (!applicableDonation.paid) {
                        unapprovedAndPaidEdits.push(edit);
                    }
                });

                return unapprovedAndPaidEdits;

            } catch (err) {
                new ApolloError('An unknown error occurred while retrieving unapproved opinions');
            }
        },
        getOpinionsModelSpecific: async (_, args, {
            Opinion,
            Donation
        }) => {
            // args destructed = { _id: String!, onModel: String! }

            const topOpinion = async function(_id) {
                const answer = await Opinion.find({
                    approved: true,
                    documentID: _id
                }).populate({
                    path: 'donation',
                    model: 'Donation'
                });
                var max = {
                    index: null,
                    value: 0
                }

                await answer.forEach(function(answerItems, i) {
                    if(answerItems.donation.amount > max.value) {
                        max.index = i;
                        max.value = answerItems.donation.amount
                    }
                })

                return answer[max.index];
            }

            const lastOpinion = async function(_id) {
                const answer = await Opinion.find({
                    approved: true,
                    documentID: _id
                }).populate({
                    path: 'donation',
                    model: 'Donation'
                })
                .sort({
                    dateApproved: 'desc'
                })
                .limit(1);

                return answer[0];
            }

            const randomOpinion = async function(_id) {
                const opinionArray = await Opinion.find({
                    approved: true,
                    documentID: args._id
                }).populate({
                    path: 'donation',
                    model: 'Donation'
                });

                return opinionArray[Math.floor(Math.random()*opinionArray.length)];
            }

            return {
                top: await topOpinion(args._id),
                last: await lastOpinion(args._id),
                random:  await randomOpinion(args._id)
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

            if (!currentUser) throw new Error('You must be logged in to perform this function!');
            /*
            //May be broken...............................
            //May be broken...............................
            //May be broken...............................
            //May be broken...............................
            */
            const bulletPoint = await BulletPoint.findOne({
                content
            });

            if (bulletPoint) {
                throw new Error('This Bullet Point already exists in the database!!');
            }

            var id = require('mongodb').ObjectID();

            const newBulletPoint = await new BulletPoint({
                _id: id,
                slug,
                pro,
                content
            }).save();

            return newBulletPoint;
        },
        setUserAllegiance: async (_, {
            allegiance
        }, {
            User,
            currentUser
        }) => {
            if (!currentUser) {
                throw new Error('You must be logged in to perform this function!')
            }

            var newUser = await User.findOne({
                username: currentUser.username
            }, function (err, user) {
                if (err) throw new Error('An unknown error has occurred!');

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
        },
        signinUser: async (_, {
            email,
            password
        }, {
            User
        }) => {
            const user = await User.findOne({
                email
            });
            if (!user) {
                throw new Error("User not found");
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error("Invalid password");
            }
            return {
                token: createToken(user, process.env.SECRET, "1hr")
            }
        },
        signupUser: async (_, {
            username,
            email,
            password
        }, {
            User
        }) => {

            //Check to make sure the user doesn't already exist
            const userInUse = await User.findOne({
                username
            });
            if (userInUse) {
                throw new Error("The username submitted is already in use");
            }
            const emailInUse = await User.findOne({
                email
            });
            if (emailInUse) {
                throw new Error("The email address submitted is already in use");
            }

            //Construct the user object to be 
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

            //Return auth token
            return {
                token: createToken(newUser, process.env.SECRET, "1hr")
            };
        },
        submitOpinionModelSpecific: async (_, args, {
            Crypto,
            Donation,
            Opinion,
            BulletPoint,
            Resource,
            currentUser
        }) => {
            // args destructed {amount: String!, documentID: ID!, onModel: String!, opinion: String!}
            if (!currentUser) throw new AuthenticationError('Log in or register to do this!');
            //if (!currentUser.emailValidated) throw new Error('Validate your email before doing this!');
            console.log(currentUser)
            if (!currentUser.allegiance) throw new AuthenticationError('Choose a faction in the Account Panel before doing this!');
            if (args.opinion.length > 280) throw new UserInputError('The maximum length of an opinion is 280 characters.');
            /*const value = await Crypto.findOne({
                ticker: 'BTC'
            });
            if (value.rate * Number(args.amount) < 1) throw new Error(`Donation amount to small! ($1 minimum aka ${1.01/result[0].rate} BTC)`);
            */

            if (args.onModel === 'BulletPoint') {

                const bulletPoint = await BulletPoint.findOne({
                    _id: args.documentID
                });
                const newInvoice = await createInvoice(args, currentUser);
                const newDonation = await createDonation(args, bulletPoint, newInvoice, Donation, currentUser);
                await createOpinion(args, bulletPoint, newDonation, Opinion, currentUser);

                return newInvoice.url;

            } else if (args.onModel === 'Resource') {

                const resource = await Resource.findOne({
                    _id: args.documentID
                });
                const newInvoice = await createInvoice(args, currentUser);
                const newDonation = await createDonation(args, resource, newInvoice, Donation, currentUser);
                await createOpinion(args, resource, newDonation, Opinion, currentUser);

                return newInvoice.url;
            }
        },
        approveOpinion: async (_, args, {
            Opinion,
            currentUser
        }) => {
            // args destructed {_id: ID!, approved: Boolean!, approvalCommentary: String!}
            //if (!currentUser.emailValidated) throw new Error('Validate your email before doing this!');
            if (!currentUser.admin) throw new AuthenticationError('You must be an Admin to do this');

            try {
                const opinion = await Opinion.findOne({
                    _id: args._id
                });

                opinion.createdBy = currentUser.username;
                opinion.approved = args.approved;
                opinion.approvedBy = currentUser.username;
                opinion.approvalCommentary = args.approvalCommentary;
                opinion.dateApproved = new Date();
                opinion.save()

                return true;

            } catch (err) {
                throw new ApolloError('An unknown error occurred while approving this opinion')
            }

        }
    }
}