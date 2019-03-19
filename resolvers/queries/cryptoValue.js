//Apollo errors
const {
    ApolloError
} = require('apollo-server');

//Resolver helpers
const {
    parseError
} = require('../helpers');

module.exports = async (_, {
    ticker
}, {
    Crypto
}) => {
    try {

        //Located the applicable document depending on the ticker
        const value = await Crypto.findOne({
            ticker: ticker
        });

        //Return the cryptocurrency's value
        return value.valueUSD;

    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while fetching the value of this cryptocurrency'));
    }
}