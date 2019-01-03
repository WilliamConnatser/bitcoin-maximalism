This repository contains a barebones implementation of the following stack:

Vue + Vue Router + Vuex + Apollo + GraphQL + Mongoose + MongoDB

It is pre-configured to be easily ran in a development environment or deployed via ZEIT Now.


## Project Overview

Almost all Mongoose, Apollo, and GraphQL logic is located server-side in the project's root directory:
```
typedefs.gql = Defines aliases for GraphQL Models
/models/Todo.js = Defines GraphQL models (aka. schemas)
server.js = MongoDB, Mongoose, and Apollo GraphQL initialization
resolvers.js = GraphQL resolvers which use Mongoose to interact with MongoDB
now.json = ZEIT Configuration and additional Environment Variables
```

In the /client directory:
```
/public/index.html = Root HTML file that the main Vue instance is loaded into
/src/App.vue = The main Vue instance
/src/components = Contains all Vue components used in the app
/src/router.js = defines routes for Vue Router package
/src/main.js = Wires Vue up to Vue Router, Apollo GraphQL, and Vuex
/src/queries.js = Abstracts away the GraphQL queries that are called from the Vuex store
/src/store.js = Controls local state, and syncs/updates local state with MongoDB via GraphQL
```

## Project Setup
Run the following commands in the root directory:
```
npm i -g now
npm install
```

^^ If you get a permissions error, re-run with sudo permissions.

Create two files in the root directory and the Client directory, and name both files "now.json". These are the ZEIT Now configuration files needed for deployment, but they are also leveraged to store environment variables necessary for a working development environment.

The now.json file in the root directory:
```
MONGO_URI=
{
    "version": 1,
    "env": {
        "MONGO_URI_DEVELOPMENT": "mongodb://username:password@afaekDevelopmentURI.mlab.com:98234089234/vuegraphqlboilerplate",
        "MONGO_URI_PRODUCTION": "mongodb://username:password@afakeProductionURI.mlab.com:98234089234/vuegraphqlboilerplate",
        "DEPLOYING": "false"
    }
}
```

The now.json file in the client directory:
```
{
    "version": 1,
    "name": "todo-app",
    "type": "static",
    "static": {
        "public": "dist",
        "rewrites": [{
            "source": "**",
            "destination": "/index.html"
        }]
    },
    "alias": "vue-graphql-mongo-boilerplate",
    "files": [
        "dist"
    ],
    "env": {
        "DEPLOYING": "false",
        "GRAPHQL_URI": "https://only-needed-for-production-deployment-ie-after-deploying-GraphQL-server-ZEIT-will-generate-this-URI.now.sh/graphql"
    }
}
```

### Compiles and hot-reloads for development

The only thing that needs to be changed in the above example configuration files *for a development environment* is the MONGO_URI_DEVELOPMENT key which should point to your development instance of MongoDB.

Always double check before starting up your development environment that the DEPLOYING booleans are set to false. Otherwise, your development environment will connect to your production deployment's database and GraphQL server which may cause unintended consequences.

Run the following from the project's root directory:
```
npm run dev
```

### Deployment

Replace the MONGO_URI_PRODUCTION key value with the URI that points to your MongoDB production database.

Change the name and alias keys in the client's now.json file to something specific to your project.

Change both configuration file's DEPLOYING environment variables to "true". Mongoose in server.js and Apollo GraphQL in /client/main.js use this boolean to switch back and forth from development to production environments.

Sign up for an account at https://zeit.co/

In the project's root directory, run the following commands:
```
now login
now
```

The above commands deploy your GraphQL server. ZEIT Now will respond with a URI to that server. You can access it via a web browser to ensure your GraphQL server is working... you should see the Apollo GraphQL playground.

Use the above described GraphQL URI by editing the value in the /client/now.json configuration file for the GRAPHQL_URI key. This URI will change each time your GraphQL server is re-deployed.

Change directories by navigating to the /client folder. Now you are ready to deploy the front end of your app. Simply type the following command:
```
npm run deploy
```

That's it! ZEIT will now generate a couple URLs you can use to access your app! A longer one, and also a shorter one that is changeable via the "alias" key in the /client now.json

Use one of these addresses to update your DNS records.