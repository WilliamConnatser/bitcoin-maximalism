//Import needed to encrypt password
const bcrypt = require("bcrypt");
//Import needed to generate jsonwebtoken to track logged in user
const jwt = require("jsonwebtoken");
//Import seed data for initial population of database
const initData = require('./initData')

const createToken = (user, secret, expiresIn) => {
    const {
        username,
        email,
        admin
    } = user;
    return jwt.sign({
        username,
        email,
        admin
    }, secret, {
        expiresIn
    });
};

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

            var cryptoValues = {};
            var aggregateValue = 0;

            await Donation.find(args, function (err, docs) {
                docs.forEach(donation => {
                    if (donations.ticker === undefined) {
                        let value = Crypto.findOne({
                            ticker: donations.ticker
                        }).value;
                        cryptoValues[donations.ticker] = value;
                    }
                    aggregateValue += donation.amount * cryptoValues[donations.ticker]
                });
            });

            return aggregateValue;
        },
        getAmountDonatedModelSpecific: async (_, args, {
            Donation,
            Crypto
        }) => {
            // args destructed = { pro: Boolean, slug: String, onModel: String }
            args.paid = true;

            var cryptoValues = {};
            var aggregateValue = 0;

            await Donation.find(args, function (err, docs) {
                docs.forEach(donation => {
                    if (donations.ticker === undefined) {
                        let value = Crypto.findOne({
                            ticker: donations.ticker
                        }).value;
                        cryptoValues[donations.ticker] = value;
                    }
                    aggregateValue += donation.amount * cryptoValues[donations.ticker]
                });
            });

            return aggregateValue;
        },
        getModel: async (_, args, {
            BulletPoint,
            Resource,
            Opinion,
            Edit,
            Certificate
        }) => {
            // args destructed = { type: String, pro: Boolean, slug: String }
            var types = ["BulletPoint", "Resource", "Opinion", "Edit", "Certificate"]
            //Ensure a valid Type was passed to the Query
            if (types.indexOf(args.type) === -1) throw new Error('This Query included an invalid Collection Type!')

            var index = types.indexOf(args.type);
            delete args.type;

            if (index == 0) {
                const bulletPoint = await BulletPoint.find(args).sort({
                    dateCreated: 'desc'
                });
                return bulletPoint;

            } else if (index == 1) {
                const resource = await Resource.find(args).sort({
                    dateCreated: 'desc'
                });
                return resource;

            } else if (index == 2) {
                const opinion = await Opinion.find(args).sort({
                    dateCreated: 'desc'
                });
                return opinion;

            } else if (index == 3) {
                const edit = await Edit.find(args).sort({
                    dateCreated: 'desc'
                });
                return edit;

            } else if (index == 4) {
                const certificate = await Certificate.find(args).sort({
                    dateCreated: 'desc'
                });
                return certificate;
            }
        }
    },
    Mutation: {
        addBulletPoint: async (_, {
            slug,
            pro,
            content
        }, {
            BulletPoint
        }) => {

            //May be broken...............................
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
        setAllegiance: async (_, {
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
                console.log(allegiance)
                if (allegiance === "Maximalist") {
                    user.maximalist = true;
                } else {
                    user.maximalist = false;
                }

                user.allegiance = true;
                user.save();
            });

            return newUser;
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
            };
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
        }
    }
}