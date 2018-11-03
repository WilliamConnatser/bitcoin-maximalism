import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Apollo Dependencies
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

Vue.use(VueApollo);

//Setup ApolloClient (exported so it can be Imported into the Vuex Store)
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
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