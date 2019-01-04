//Vue & Vuex Imports
import Vue from 'vue';
import App from './App.vue';
import store from './store';

//ZEIT Now and Environment Variables Imports
require('now-env');

//Apollo Dependencies & Initialization
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

//fullpage.js imports
import 'fullpage.js/vendors/scrolloverflow.min.js';
import 'fullpage.js/dist/fullpage.min.js';
import 'fullpage.js/dist/fullpage.min.css';
import VueFullPage from 'vue-fullpage.js';

//Tie Vue instance to fullpage.js and vue-apollo
Vue.use(VueApollo);
Vue.use(VueFullPage)

//Set the Apollo URI to what's stored in the now.json file if the app is being deployed
if (process.env.DEPLOYING !== "false") {
    var apolloURI = 'http://localhost:4000/graphql'
} else {
    var apolloURI = process.env.GRAPHQL_URI;
}

//Setup ApolloClient (exported so it can be Imported into the Vuex Store)
export const defaultClient = new ApolloClient({
    uri: apolloURI
});

//Setup VueApollo
const apolloProvider = new VueApollo({
    defaultClient
});

Vue.config.productionTip = false;

new Vue({
    //apolloProvider injects Apollo into each of our Vue Components
    apolloProvider,
    router,
    store,
    render: h => h(App)
}).$mount('#app')