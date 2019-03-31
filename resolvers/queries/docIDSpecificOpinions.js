//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
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
                    active: true,
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
                    active: true,
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
}