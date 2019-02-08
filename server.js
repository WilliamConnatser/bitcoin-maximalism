//ZEIT Now configuration
require('now-env');

//Dependencies for/and GraphQL typeDefs
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');

//GraphQL dependencies and resolvers
const {
    ApolloServer
} = require('apollo-server');
const resolvers = require('./resolvers');

//MongoDB / Mongoose dependency & Models
const mongoose = require('mongoose');
const Rhetoric = require('./models/Rhetoric');
const Edit = require('./models/Edit');
const Opinion = require('./models/Opinion');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');
const Donation = require('./models/Donation');
const BulletPoint = require('./models/BulletPoint');
const User = require('./models/User');
const Vote = require('./models/Vote');
const Crypto = require('./models/Crypto');

//Needed to authenticate the token sent from the client
const jwt = require('jsonwebtoken');

//Import the function that's ran on startup
const startup = require('./startup');

//Dynamically set the appropriate MongoDB URI
//Depends on if the app is being deployed or ran in a development environment
//All environment variables can be found in the now.json file
if (process.env.DEPLOYING === "false") {
    var mongoURI = process.env.MONGO_URI_DEVELOPMENT;
} else {
    var mongoURI = process.env.MONGO_URI_PRODUCTION;
}

//Connect to MongoDB via mongoose
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true
    })
    .then(async ({
        models
    }) => {
        console.log("MongoDB Database Connected")

        //Run startup utilities
        startup(models);
    })
    .catch(err => console.log(err));

//Verify Json Web Token sent from the client's localStorage
//This injects the current user object into the resolvers' context
const getUser = async (token) => {
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (err) {
            return null;
        }
    }
}

//Create Apollo GraphQL Server with typeDefs, resolvers, and context containing models/schemas
const server = new ApolloServer({
    typeDefs,
    resolvers,
    //Make errors pretty
    formatError: error => {
        console.log(error);
        return {
            name: error.name,
            message: error.message
        }
    },
    //Controls what's accessible via each resolvers' context
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
            Vote,
            Crypto,
            currentUser: await getUser(token),
            operationName
        }
    }
});

//Start the Apollo GraphQL Server
server.listen().then(({
    url
}) => {
    //Print the URL to the terminal to access the GraphQL Playground
    console.log(`🚀🚀🚀🚀🚀🚀 GraphQL Server Started on ${url}`)
});