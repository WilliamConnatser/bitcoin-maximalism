//Vue Imports
import Vue from 'vue';
import App from './App.vue';

//Vue-Router
import VueRouter from 'vue-router';
import router from './router.js';
Vue.use(VueRouter);

//ZEIT Now and Environment Variables Imports
require('now-env');

//Apollo Dependencies, Initialization, and ApolloClient Local State
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';
import resolvers from './localState/resolvers';
import defaults from './localState/defaults';
import typeDefs from './localState/typeDefs';
Vue.use(VueApollo);

//Font Awesome
import {
    library
} from '@fortawesome/fontawesome-svg-core';
import {
    faAngleUp,
    faAngleDown,
    faComment,
    faPlusSquare,
    faMinusSquare,
    faPenSquare,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
library.add(faAngleUp, faAngleDown, faComment, faPlusSquare, faMinusSquare, faPenSquare, faSearch);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// register the plugin on vue
import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    duration: 5000,
    iconPack: 'fontawesome',
    router,
    icon: 'fa-exclamation-circle',
    action: {
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }
});

Vue.toasted.register('log_in', 'You must log in or register before doing this', {
    duration: 5000,
    icon: 'fa-exclamation-circle',
    action: [{
      text: 'Close',
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      }
    },{
      text: 'Log in or Register',
      push: '/account'
    }]
  });

  Vue.toasted.register('assign_allegiance', 'You must choose a faction on your Account Panel before doing this', {
    duration: 5000,
    icon: 'fa-exclamation-circle',
    action: [{
      text: 'Close',
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      }
    },{
      text: 'Choose a faction',
      push: '/account'
    }]
  });


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
    onError: ({
        operation,
        graphQLErrors,
        networkError
    }) => {
        if (networkError) Vue.toasted.show(networkError.message);
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                Vue.toasted.show(err.message);
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