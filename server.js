//MongoDB / Mongoose dependencies
const mongoose = require('mongoose');

//Import ZEIT Now configuration
require('now-env')

//Node Modules needed to import GraphQL typeDefs
const fs = require('fs');
const path = require('path');

//GraphQL dependencies, typeDefs, resolvers, and models
const {
    ApolloServer, AuthenticationError
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
    .then(() => console.log("MongoDB Database Connected"))
    .catch(err => console.log(err));

//Verify Json Web Token sent from the client.
const getUser = async (token) => {
    if(token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        }
        catch {
            return null;
        }
    }
}

//Create Apollo GraphQL Server with typeDefs, resolvers, and context containing models/schemas
const server = new ApolloServer({
    typeDefs,
    resolvers,/*
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