//MongoDB / Mongoose dependencies
const mongoose = require('mongoose');

//Import ZEIT Now configuration
require('now-env');



//BTCPay Server
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));

// Recreate client ... used every time you nee to talk to the BTCPAY server
const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, {
    merchant: process.env.BTCPAY_MERCHANT
});

/*
//Only needed for initial pairing
client
  .pair_client(<PAIRCODE?)
  .then(res => console.log(res))
  .catch(err => console.log(err))
  //Everything above needed for pairing. Use code printed to console for PAIRCODE



//Get current BTC Price
client.get_rates('BTC_USD', process.env.BTCPAY_STOREID)
    .then(rates => console.log(rates))
    .catch(err => console.log(err))

    //RESPONSE FROM get_rates 'BTC_USD'

    [ { name: 'US Dollar',
[server]     cryptoCode: 'BTC',
[server]     currencyPair: 'BTC_USD',
[server]     code: 'USD',
[server]     rate: 3549.82438868746 } ]




//Create an invoice
client.create_invoice({
        price: 0.0000001,
        currency: 'BTC',
        itemDesc: 'Invoice Description',
        buyer: {
            name: 'username',
            email: 'email'
        }
    })
    .then(invoice => console.log(invoice, invoice.url))
    .catch(err => console.log(err))


    RESPONSE FROM create_invoice:

    { url:
[server]    'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM',
[server]   posData: null,
[server]   status: 'new',
[server]   btcPrice: '0.00562100',
[server]   btcDue: '0.00562100',
[server]   cryptoInfo:
[server]    [ { cryptoCode: 'BTC',
[server]        paymentType: 'BTCLike',
[server]        rate: 3558.08978812063,
[server]        exRates: [Object],
[server]        paid: '0.00000000',
[server]        price: '0.00562100',
[server]        due: '0.00562100',
[server]        paymentUrls: [Object],
[server]        address: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]        url:
[server]         'https://mainnet.demo.btcpayserver.org/i/BTC/UNgz9TvKFYUE8Uq7US81sM',
[server]        totalDue: '0.00562100',
[server]        networkFee: '0.00000000',
[server]        txCount: 0,
[server]        cryptoPaid: '0.00000000' } ],
[server]   price: 20,
[server]   currency: 'USD',
[server]   exRates: { USD: 0 },
[server]   buyerTotalBtcAmount: null,
[server]   itemDesc: null,
[server]   orderId: null,
[server]   guid: '40d3601a-c8d3-4db4-8c3d-219413566dd8',
[server]   id: 'UNgz9TvKFYUE8Uq7US81sM',
[server]   invoiceTime: 1548039574000,
[server]   expirationTime: 1548040474000,
[server]   currentTime: 1548039574618,
[server]   lowFeeDetected: false,
[server]   btcPaid: '0.00000000',
[server]   rate: 3558.08978812063,
[server]   exceptionStatus: false,
[server]   paymentUrls:
[server]    { BIP21:
[server]       'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]      BIP72: null,
[server]      BIP72b: null,
[server]      BIP73: null,
[server]      BOLT11: null },
[server]   refundAddressRequestPending: false,
[server]   buyerPaidBtcMinerFee: null,
[server]   bitcoinAddress: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]   token: 'H6XLvfeEz2qy1mGcFNvpKK',
[server]   flags: { refundable: false },
[server]   paymentSubtotals: { BTC: 562100 },
[server]   paymentTotals: { BTC: 562100 },
[server]   amountPaid: 0,
[server]   minerFees: { BTC: { satoshisPerByte: 1, totalFee: 0 } },
[server]   exchangeRates: { BTC: { USD: 0 } },
[server]   supportedTransactionCurrencies: { BTC: { enabled: true } },
[server]   addresses: { BTC: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5' },
[server]   paymentCodes:
[server]    { BTC:
[server]       { BIP21:
[server]          'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]         BIP72: null,
[server]         BIP72b: null,
[server]         BIP73: null,
[server]         BOLT11: null } },
[server]   buyer:
[server]    { name: null,
[server]      address1: null,
[server]      address2: null,
[server]      locality: null,
[server]      region: null,
[server]      postalCode: null,
[server]      country: null,
[server]      phone: null,
[server]      email: null } } 'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM'




//Passed property id from the create_invoice response above
client.get_invoice('UNgz9TvKFYUE8Uq7US81sM')
  .then(invoice => console.log(invoice))
  .catch(err => console.log(err))


  Received this from get_invoice:
  { url:
    [server]    'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM',
    [server]   posData: null,
    [server]   status: 'new',
    [server]   btcPrice: '0.00562100',
    [server]   btcDue: '0.00562100',
    [server]   cryptoInfo:
    [server]    [ { cryptoCode: 'BTC',
    [server]        paymentType: 'BTCLike',
    [server]        rate: 3558.08978812063,
    [server]        exRates: [Object],
    [server]        paid: '0.00000000',
    [server]        price: '0.00562100',
    [server]        due: '0.00562100',
    [server]        paymentUrls: [Object],
    [server]        address: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
    [server]        url:
    [server]         'https://mainnet.demo.btcpayserver.org/i/BTC/UNgz9TvKFYUE8Uq7US81sM',
    [server]        totalDue: '0.00562100',
    [server]        networkFee: '0.00000000',
    [server]        txCount: 0,
    [server]        cryptoPaid: '0.00000000' } ],
    [server]   price: 20,
    [server]   currency: 'USD',
    [server]   exRates: { USD: 0 },
    [server]   buyerTotalBtcAmount: null,
    [server]   itemDesc: null,
    [server]   orderId: null,
    [server]   guid: 'f0dea015-13dc-4579-a181-09ff93ab2d90',
    [server]   id: 'UNgz9TvKFYUE8Uq7US81sM',
    [server]   invoiceTime: 1548039574000,
    [server]   expirationTime: 1548040474000,
    [server]   currentTime: 1548039861712,
    [server]   lowFeeDetected: false,
    [server]   btcPaid: '0.00000000',
    [server]   rate: 3558.08978812063,
    [server]   exceptionStatus: false,
    [server]   paymentUrls:
    [server]    { BIP21:
    [server]       'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
    [server]      BIP72: null,
    [server]      BIP72b: null,
    [server]      BIP73: null,
    [server]      BOLT11: null },
    [server]   refundAddressRequestPending: false,
    [server]   buyerPaidBtcMinerFee: null,
    [server]   bitcoinAddress: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
    [server]   token: '9JNoYKrnFNp3Crysco9hRN',
    [server]   flags: { refundable: false },
    [server]   paymentSubtotals: { BTC: 562100 },
    [server]   paymentTotals: { BTC: 562100 },
    [server]   amountPaid: 0,
    [server]   minerFees: { BTC: { satoshisPerByte: 1, totalFee: 0 } },
    [server]   exchangeRates: { BTC: { USD: 0 } },
    [server]   supportedTransactionCurrencies: { BTC: { enabled: true } },
    [server]   addresses: { BTC: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5' },
    [server]   paymentCodes:
    [server]    { BTC:
    [server]       { BIP21:
    [server]          'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
    [server]         BIP72: null,
    [server]         BIP72b: null,
    [server]         BIP73: null,
    [server]         BOLT11: null } },
    [server]   buyer:
    [server]    { name: null,
    [server]      address1: null,
    [server]      address2: null,
    [server]      locality: null,
    [server]      region: null,
    [server]      postalCode: null,
    [server]      country: null,
    [server]      phone: null,
    [server]      email: null } }


    AFTER THE INVOICE EXPIRED below:::::::
    { url:
[server]    'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM',
[server]   posData: null,
[server]   status: 'expired',
[server]   btcPrice: '0.00562100',
[server]   btcDue: '0.00562100',
[server]   cryptoInfo:
[server]    [ { cryptoCode: 'BTC',
[server]        paymentType: 'BTCLike',
[server]        rate: 3558.08978812063,
[server]        exRates: [Object],
[server]        paid: '0.00000000',
[server]        price: '0.00562100',
[server]        due: '0.00562100',
[server]        paymentUrls: [Object],
[server]        address: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]        url:
[server]         'https://mainnet.demo.btcpayserver.org/i/BTC/UNgz9TvKFYUE8Uq7US81sM',
[server]        totalDue: '0.00562100',
[server]        networkFee: '0.00000000',
[server]        txCount: 0,
[server]        cryptoPaid: '0.00000000' } ],
[server]   price: 20,
[server]   currency: 'USD',
[server]   exRates: { USD: 0 },
[server]   buyerTotalBtcAmount: null,
[server]   itemDesc: null,
[server]   orderId: null,
[server]   guid: '70938452-b58c-4bab-ab7f-85c846aa69cb',
[server]   id: 'UNgz9TvKFYUE8Uq7US81sM',
[server]   invoiceTime: 1548039574000,
[server]   expirationTime: 1548040474000,
[server]   currentTime: 1548040770620,
[server]   lowFeeDetected: false,
[server]   btcPaid: '0.00000000',
[server]   rate: 3558.08978812063,
[server]   exceptionStatus: false,
[server]   paymentUrls:
[server]    { BIP21:
[server]       'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]      BIP72: null,
[server]      BIP72b: null,
[server]      BIP73: null,
[server]      BOLT11: null },
[server]   refundAddressRequestPending: false,
[server]   buyerPaidBtcMinerFee: null,
[server]   bitcoinAddress: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]   token: 'Bizwv1cH35SeSX8nS2WZpQ',
[server]   flags: { refundable: false },
[server]   paymentSubtotals: { BTC: 562100 },
[server]   paymentTotals: { BTC: 562100 },
[server]   amountPaid: 0,
[server]   minerFees: { BTC: { satoshisPerByte: 1, totalFee: 0 } },
[server]   exchangeRates: { BTC: { USD: 0 } },
[server]   supportedTransactionCurrencies: { BTC: { enabled: true } },
[server]   addresses: { BTC: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5' },
[server]   paymentCodes:
[server]    { BTC:
[server]       { BIP21:
[server]          'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]         BIP72: null,
[server]         BIP72b: null,
[server]         BIP73: null,
[server]         BOLT11: null } },
[server]   buyer:
[server]    { name: null,
[server]      address1: null,
[server]      address2: null,
[server]      locality: null,
[server]      region: null,
[server]      postalCode: null,
[server]      country: null,
[server]      phone: null,
[server]      email: null } }

    */


//Node Modules needed to import GraphQL typeDefs
const fs = require('fs');
const path = require('path');

//GraphQL dependencies, typeDefs, resolvers, and models
const {
    ApolloServer
} = require('apollo-server');
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');
const Rhetoric = require('./models/Rhetoric');
const Edit = require('./models/Edit');
const Opinion = require('./models/Opinion');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');
const Donation = require('./models/Donation');
const BulletPoint = require('./models/BulletPoint');
const User = require('./models/User');
const Crypto = require('./models/Crypto');

//Needed to authenticate the token sent from the client
const jwt = require('jsonwebtoken');

//Import seed data for initial population of database
const initData = require('./initData')

//Dynamically set the appropriate MongoDB URI
//Depends on if the app is being deployed or ran in a development environment
//All environment variables can be found in the now.json file
if (process.env.DEPLOYING === "false") {
    var mongoURI = process.env.MONGO_URI_DEVELOPMENT;
} else {
    var mongoURI = process.env.MONGO_URI_PRODUCTION;
}

/*
//Nomics Cryptocurrency API
const Nomics = require('nomics');
const nomicsAPI = new Nomics.NomicsNode({
    apiKey: process.env.NOMICS
});

var prices = nomicsAPI.pricesObject();
prices.then(function (result) {
    console.log(result)
}, function (err) {
    console.log(err)
});
*/


//Connect to MongoDB
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true
    })
    .then(async ({
        models
    }) => {
        console.log("MongoDB Database Connected")

        async function originalInitialization() {
            //Initialize the database on the first start up
            await models.BulletPoint.findOne({}, async (err, result) => {
                if (!result) await models.BulletPoint.collection.insertMany(initData.bulletPoint)
            });
            await models.Resource.findOne({}, async (err, result) => {
                if (!result) await models.Resource.collection.insertMany(initData.resource)
            });
            await models.Rhetoric.findOne({}, async (err, result) => {
                if (!result) await models.Rhetoric.collection.insertMany(initData.rhetoric)
            });
        }

        function populateBulletPoints() {
            models.BulletPoint.find({}, async (err, results) => {
                for (const bulletPoint of results) {
                    Rhetoric.findOne({
                        slug: bulletPoint.slug,
                        pro: bulletPoint.pro
                    }, async (err, rhetoric) => {
                        var arrayToCompare = rhetoric.bulletPoints.map(function (v) {
                            return v.toString();
                        });
                        if (bulletPoint !== undefined) {
                            if (bulletPoint.slug === rhetoric.slug && bulletPoint.pro === rhetoric.pro) {
                                if (arrayToCompare.indexOf(bulletPoint._id.toString()) < 0) {
                                    rhetoric.bulletPoints.push(bulletPoint._id);
                                    rhetoric.save();
                                }
                            }
                        }
                    });
                }
            });
        }

        function populateResources() {
            models.Resource.find({}, async (err, results) => {
                for (const resource of results) {
                    Rhetoric.findOne({
                        slug: resource.slug,
                        pro: resource.pro
                    }, async (err, rhetoric) => {
                        var arrayToCompare = rhetoric.resources.map(function (v) {
                            return v.toString();
                        });
                        if (resource !== undefined) {
                            if (resource.slug === rhetoric.slug && resource.pro === rhetoric.pro) {
                                if (arrayToCompare.indexOf(resource._id.toString()) < 0) {
                                    rhetoric.resources.push(resource._id);
                                    rhetoric.save();
                                }
                            }
                        }
                    });
                }
            });
        }

        function populateResourceRhetoric() {
            models.Resource.find({}, (err, results) => {
                for (const resource of results) {
                    Rhetoric.findOne({
                        slug: "resources",
                        pro: resource.pro
                    }, (err, rhetoric) => {

                        var arrayToCompare = rhetoric.resources.map(function (v) {
                            return v.toString();
                        });
                        if (resource !== undefined) {
                            if (resource.pro === rhetoric.pro) {
                                if (arrayToCompare.indexOf(resource._id.toString()) < 0) {
                                    rhetoric.resources.push(resource._id);
                                    rhetoric.save();
                                }
                            }
                        }
                    });
                }
            })
        }

        await originalInitialization();
        populateBulletPoints();
        populateResources();
        populateResourceRhetoric();

        function updateBitcoinValue() {
            client.get_rates('BTC_USD', process.env.BTCPAY_STOREID)
                .then(async function (rates) {

                    var cryptoDoc = await Crypto.findOne({
                        ticker: 'BTC'
                    });

                    if (cryptoDoc) {

                        cryptoDoc.valueUSD = Number(rates[0].rate);
                        cryptoDoc.save();

                    } else {

                        var id = require('mongodb').ObjectID();
                        const newCrypto = new Crypto({
                            _id: id,
                            ticker: 'BTC',
                            valueUSD: Number(rates[0].rate)
                        }).save();
                    }
                })
                .catch(err => console.log(err))
        }

        //Update the Bitcoin value on startup
        updateBitcoinValue();

        //Update the Bitcoin value every hour
        setInterval(function () {
            updateBitcoinValue();
        }, 60 * 60000);
    })
    .catch(err => console.log(err));

//Verify Json Web Token sent from the client.
const getUser = async (token) => {
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch {
            return null;
        }
    }
}

//Create Apollo GraphQL Server with typeDefs, resolvers, and context containing models/schemas
const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: error => ({
        name: error.name,
        message: error.message
    }),
    context: async ({
        req
    }) => {
        const token = req.headers['authorization'];
        const operationName = req.body.operationName;

        return {
            Edit,
            Opinion,
            Resource,
            Rhetoric,
            Certificate,
            Donation,
            BulletPoint,
            User,
            Crypto,
            currentUser: await getUser(token),
            operationName
        }
    }
});

//Print the URL to the terminal to access the GraphQL Playground
server.listen().then(({
    url
}) => {
    //The GraphQL Server is running- Send a link to the console
    console.log(`>>>>>>>> GraphQL Server Started on ${url}`)
});