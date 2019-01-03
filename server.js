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
const Todo = require('./models/Todo');

//Dynamically set the appropriate MongoDB URI
//Depends on if the app is being deployed or ran in a development environment
//All environment variables can be found in the now.json file
if(process.env.DEPLOYING === "false") {
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
    .catch(err => console.log(err))

//Create Apollo GraphQL Server with typeDefs, resolvers, and context containing models/schemas
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        Todo
    }
});

//Print the URL to the terminal to access the GraphQL Playground
server.listen().then(({
    url
}) => {
    console.log(`>>>>>>>> GraphQL Server Started on ${url}`)
});