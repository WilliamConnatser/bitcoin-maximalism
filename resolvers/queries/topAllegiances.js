//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    sortByVote,
    parseError
} = require('../helpers');

module.exports = async (_, {
    type
}, {
    Donation,
    User,
    Vote,
    Rhetoric,
    Resource,
    BulletPoint,
    Opinion
}) => {
    try {
        if (type !== 'mostRaised' &&
            type !== 'mostInfluence' &&
            type !== 'mostUpvotes' &&
            type !== 'mostOpinions' &&
            type !== 'mostUsers' &&
            type !== 'mostArguments' &&
            type !== 'mostResources' &&
            type !== 'mostBulletPoints') throw new UserInputError('invalid-model');

        let proCount = 0;
        let antCount = 0;

        switch (type) {
            case 'mostRaised':

                const donations = await Donation.find({
                    paid: true
                })
                    .populate({
                        path: 'createdBy',
                        model: 'User'
                    });

                donations.forEach(donation => {
                    if (donation.onModel === 'Project') {
                        if (donation.metaSlug.maximalist) {
                            proCount += donation.preBonusAmount;
                        } else {
                            antCount += donation.preBonusAmount;
                        }
                    }
                });

                break;

            case 'mostInfluence':

                const proUsers = await User.find({
                    maximalist: true,
                    active: true
                });
                const antUsers = await User.find({
                    maximalist: false,
                    active: true
                });
                if (proUsers.length > 0) proCount = proUsers.reduce((previous, current) => previous + current.accruedDonations, 0);
                if (antUsers.length > 0) antCount = antUsers.reduce((previous, current) => previous + current.accruedDonations, 0);


                break;

            case 'mostUpvotes':

                const proVotes = await Vote.find({
                        metaSlug: 'protagonistic'
                    })
                    .populate({
                        path: 'createdBy',
                        model: 'User',
                        select: '_id username accruedDonations'
                    });

                const antVotes = await Vote.find({
                        metaSlug: 'antagonistic'
                    })
                    .populate({
                        path: 'createdBy',
                        model: 'User',
                        select: '_id username accruedDonations'
                    });

                if (proVotes.length > 0) proCount = proVotes.reduce(function (previous, vote) {
                    if (vote.upVote) {
                        return previous + vote.createdBy.accruedDonations;
                    } else {
                        return previous - vote.createdBy.accruedDonations;
                    }
                }, 0);

                if (antVotes.length > 0) antCount = antVotes.reduce(function (previous, vote) {
                    if (vote.upVote) {
                        return previous + vote.createdBy.accruedDonations;
                    } else {
                        return previous - vote.createdBy.accruedDonations;
                    }
                }, 0);

                break;

            case 'mostOpinions':

                proCount = await Opinion.find({
                    metaSlug: "protagonistic",
                    active: true,
                    approved: true
                }).countDocuments();
                antCount = await Opinion.find({
                    metaSlug: "antagonistic",
                    active: true,
                    approved: true
                }).countDocuments();

                break;

            case 'mostUsers':

                proCount = await User.find({
                    maximalist: true,
                    active: true
                }).countDocuments();
                antCount = await User.find({
                    maximalist: false,
                    active: true
                }).countDocuments();

                break;

            case 'mostArguments':

                proCount = await Rhetoric.find({
                    metaSlug: 'protagonistic',
                    active: true,
                    approved: true
                }).countDocuments();
                antCount = await Rhetoric.find({
                    metaSlug: 'antagonistic',
                    active: true,
                    approved: true
                }).countDocuments();

                break;

            case 'mostResources':

                proCount = await Resource.find({
                    metaSlug: 'protagonistic',
                    active: true,
                    approved: true
                }).countDocuments();
                antCount = await Resource.find({
                    metaSlug: 'antagonistic',
                    active: true,
                    approved: true
                }).countDocuments();

                break;

            case 'mostBulletPoints':

                proCount = await BulletPoint.find({
                    metaSlug: 'protagonistic',
                    active: true,
                    approved: true
                }).countDocuments();
                antCount = await BulletPoint.find({
                    metaSlug: 'antagonistic',
                    active: true,
                    approved: true
                }).countDocuments();

                break;
        }

        if (proCount > antCount) {
            return [{
                    allegiance: "protagonistic",
                    rank: 1,
                    amount: proCount
                },
                {
                    allegiance: "antagonistic",
                    rank: 2,
                    amount: antCount
                }
            ]
        } else {
            return [{
                    allegiance: "antagonistic",
                    rank: 1,
                    amount: antCount
                },
                {
                    allegiance: "protagonistic",
                    rank: 2,
                    amount: proCount
                }
            ]
        }

    } catch (err) {
        console.log(err)
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these allegiances'));
    }
}