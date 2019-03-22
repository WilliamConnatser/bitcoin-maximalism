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
    type,
    descending,
    limit
}, {
    Project,
    Rhetoric,
    Resources,
    BulletPoints
}) => {
    try {
        if (type !== 'mostDonated' &&
            type !== 'mostInfluence' &&
            type !== 'mostUpvotes' &&
            type !== 'mostOpinions' &&
            type !== 'mostUsers' &&
            type !== 'mostArguments' &&
            type !== 'mostResources' &&
            type !== 'mostBulletPoints') throw new UserInputError('invalid-model');
        if (limit < 1) throw new UserInputError('invalid-limit');

        switch (type) {
            case 'mostDonated':

                let proCount = 0;
                let antCount = 0;

                const donations = await Donations.find({})
                    .populate({
                        path: 'createdBy',
                        model: 'User'
                    });

                donations.forEach(donation => {
                    if (donation.createdBy.maximalist !== undefined) {
                        if (donation.createdBy.maximalist) {
                            proCount += donation.preBonusAmount;
                        } else {
                            antCount += donation.preBonusAmount;
                        }
                    }
                });

            case 'mostInfluence':

                const proUsers = await User.find({
                    maximalist: true
                });
                const antUsers = await User.find({
                    maximalist: false
                });
                const proCount = proUsers.reduce((previous, current) => previous + current.accruedDonations);
                const antCount = antUsers.reduce((previous, current) => previous + current.accruedDonations);


            case 'mostUpvotes':

                let proCount = 0;
                let antCount = 0;

                const votes = await Votes.find({})
                    .populate({
                        path: 'createdBy',
                        model: 'User',
                        select: '_id username accruedDonations'
                    });

                votes.forEach(vote => {
                    if (vote.metaSlug === 'protagonistic') {
                        if (upVote) proCount += vote.createdBy.accruedDonations;
                        else proCount -= vote.createdBy.accruedDonations;
                    } else {
                        if (upVote) antCount += vote.createdBy.accruedDonations;
                        else antCount -= vote.createdBy.accruedDonations;
                    }
                });


            case 'mostOpinions':

                let proCount = await Opinion.find({
                    metaSlug: "protagonistic"
                }).countDocuments();
                let antCount = await Opinion.find({
                    metaSlug: "antagonistic"
                }).countDocuments();

            case 'mostUsers':

                let proCount = await User.find({
                    maximalist: true
                }).countDocuments();
                let antCount = await User.find({
                    maximalist: false
                }).countDocuments();

            case 'mostArguments':

                let proCount = await Rhetoric.find({
                    metaSlug: 'protagonistic'
                }).countDocuments();
                let conCount = await Rhetoric.find({
                    metaSlug: 'antagonistic'
                }).countDocuments();

            case 'mostResources':

                let proCount = await Resource.find({
                    metaSlug: 'protagonistic'
                }).countDocuments();
                let antCount = await Resource.find({
                    metaSlug: 'antagonistic'
                }).countDocuments();

            case 'mostBulletPoints':

                let proCount = await BulletPoint.find({
                    metaSlug: 'protagonistic'
                }).countDocuments();
                let antCount = await BulletPoint.find({
                    metaSlug: 'antagonistic'
                }).countDocuments();
        }

        /*
            return await rhetoric.sort((a, b) => {
                if (descending) {
                    return b.opinions.length - a.opinions.length;
                } else {
                    return a.opinions.length - b.opinions.length;
                }
            }).slice(0, limit); */

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while aggregating these arguments'));
    }
}