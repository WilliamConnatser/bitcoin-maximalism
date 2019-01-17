//Vue Imports
import Vue from 'vue';
import App from './App.vue';

//Vue-Router
import VueRouter from 'vue-router';
import router from './router.js';

//ZEIT Now and Environment Variables Imports
require('now-env');

//Apollo Dependencies, Initialization, and ApolloClient Local State
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';
import resolvers from './localState/resolvers';
import defaults from './localState/defaults';
import typeDefs from './localState/typeDefs';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleUp, faAngleDown, faCommentDollar, faComment, faPlusSquare, faMinusSquare, faPenSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faAngleUp, faAngleDown, faCommentDollar, faComment, faPlusSquare, faMinusSquare, faPenSquare);

Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.use(VueRouter);
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
    clientState: {
        defaults,
        resolvers,
        typeDefs
    },
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
    onError: ({ operation, graphQLErrors, networkError }) => {
        console.log("The following Error occurred on this Operation:", operation);
        if (networkError) console.log("[networkError]", networkError);
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                console.log("[GraphqlError:]", err);
            }
        }
    }
});

//Setup VueApollo using ApolloClient defined above
const apolloProvider = new VueApollo({
    defaultClient
});

Vue.config.productionTip = false;

new Vue({
    //apolloProvider injects Apollo into each of our Vue Components
    apolloProvider,
    router,
    render: h => h(App)
}).$mount('#app');