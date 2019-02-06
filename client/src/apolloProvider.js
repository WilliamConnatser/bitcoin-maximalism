//Vue Imports
import Vue from 'vue';

//ZEIT Now and Environment Variables Imports
require('now-env');

//Apollo Dependencies
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

/*
//Apollo Local State (NOT IN USE)
import resolvers from '../localState/resolvers';
import defaults from '../localState/defaults';
import typeDefs from '../localState/typeDefs';
*/

//Tie VueApollo to Vue
Vue.use(VueApollo);

//Set the Apollo URI to what's stored in the now.json file if the app is being deployed
var apolloURI = ''
if (process.env.DEPLOYING !== "false") {
    apolloURI = 'http://localhost:4000/graphql'
} else {
    apolloURI = process.env.GRAPHQL_URI;
}

//Setup ApolloClient (exported so it can be Imported into the Vuex Store)
export const defaultClient = new ApolloClient({
    //Set URI
    uri: apolloURI,
    //Include Auth Token
    fetchOptions: {
        credentials: "include"
    },
    /*clientState: {
        defaults,
        resolvers,      //LOCAL STATE NOT CURRENTLY IN USE
        typeDefs
    },*/
    //Triggered with every request
    request: operation => {
        //If no token in local storage, then add it
        if (!localStorage.token) localStorage.setItem("token", "");

        //Add token to the GraphQL Authorization Header, which is sent to GraphQL server for authorization
        operation.setContext({
            headers: {
                authorization: localStorage.getItem("token")
            }
        });
    },
    //Catches all errors
    onError: ({
        operation,
        graphQLErrors,
        networkError
    }) => {
        //operations object not currently in use, but stores query/mutation data the error occurred on
        if (networkError) Vue.toasted.show(networkError.message);
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                if(err.message == 'verify-email') {
                    Vue.toasted.global.verify_email();
                } else if(err.message == 'log-in') {
                    Vue.toasted.global.log_in();
                } else {
                    Vue.toasted.show(err.message);
                }
            }
        }
    }
});

//Setup VueApollo using ApolloClient defined above
export const apolloProvider = new VueApollo({
    defaultClient
});