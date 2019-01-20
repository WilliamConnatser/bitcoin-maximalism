//MongoDB / Mongoose dependencies
const mongoose = require('mongoose');

//Import ZEIT Now configuration
require('now-env');

const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));

// Recreate client
const client = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, {merchant: process.env.BTCPAY_MERCHANT});

client.get_rates('BTC_USD', process.env.BTCPAY_STOREID)
  .then(rates => console.log(rates))
  .catch(err => console.log(err))

  client.create_invoice({price: 20, currency: 'USD'})
  .then(invoice => console.log(invoice, invoice.url))
  .catch(err => console.log(err))

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