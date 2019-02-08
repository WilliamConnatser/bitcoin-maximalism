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

//Setup ApolloClient (exported so it can be Imported into the Vuex Store)
export const defaultClient = new ApolloClient({
    //TODO: Set URI to 'http://localhost:4000/graphql' in development
    //Current Now URI: https://bitcoin-maximalism-server-8oli3x6eo.now.sh
    //In production, use the URI returned after deploying the backend
    uri: 'https://bitcoinmaximalism.herokuapp.com/graphql',
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
        //operation,      operations stores query/mutation data the error occurred on
        graphQLErrors,
        networkError
    }) => {
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