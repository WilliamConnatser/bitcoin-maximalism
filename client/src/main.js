import '@babel/polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

//Import ZEIT Now configuration
require('now-env')

//Apollo Dependencies
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

Vue.use(VueApollo);

//Set the URI to what's stored in the now.json file if the app is being deployed
if(process.env.DEPLOYING !== "false") {
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