//MongoDB / Mongoose dependencies
const mongoose = require('mongoose');

//Import ZEIT Now configuration
require('now-env')

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

//Connect to MongoDB
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true
    })
    .then(async ({
        models
    }) => {
        console.log("MongoDB Database Connected")

        var originalInitialization = async () => {
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

        var originalPopulation = async () => {

            var bulletPointDocumentArray = []
            await models.BulletPoint.find({}, async (err, result) => {
                bulletPointDocumentArray = result;

                for (var i = 0; i < bulletPointDocumentArray.length; i++) {

                    if (bulletPointDocumentArray[i] !== undefined) {

                        await Rhetoric.findOne({
                            slug: bulletPointDocumentArray[i].slug
                        }, async (err, rhetoric) => {

                            var arrayToCompare = rhetoric.bulletPoints.map(function (v) {
                                return v.toString();
                            });

                            if (arrayToCompare.indexOf(bulletPointDocumentArray[i]._id.toString()) < 0) {
                                rhetoric.bulletPoints.push(bulletPointDocumentArray[i]._id);
                                await rhetoric.save();
                            }
                        });
                    }
                }
            });
            var resourceDocumentArray = []
            await models.Resource.find({}, async (err, result) => {
                resourceDocumentArray = result;

                for (var i = 0; i < resourceDocumentArray.length; i++) {

                    if (resourceDocumentArray[i] !== undefined) {

                        await Rhetoric.findOne({
                            slug: resourceDocumentArray[i].slug
                        }, async (err, rhetoric) => {

                            var arrayToCompare = rhetoric.resources.map(function (v) {
                                return v.toString();
                            });

                            if (arrayToCompare.indexOf(resourceDocumentArray[i]._id.toString()) < 0) {
                                rhetoric.resources.push(resourceDocumentArray[i]._id);
                                await rhetoric.save();
                            }
                        });
                    }
                }
            });
        }

        await originalInitialization();
        //await originalPopulation(); Tired of wasting time debugging this...
        //Comment out this function after it's ben run once so duplicate document IDs aren't pushed to arrays
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
    /*
        formatError: error => ({
            name: error.name,
            message: error.message
        }),*/
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