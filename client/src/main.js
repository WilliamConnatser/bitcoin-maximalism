//Vue Imports
import Vue from 'vue';
import App from './App.vue';

//ZEIT Now and Environment Variables Imports
require('now-env');

/* 
    Abstracted away all of the following:

*/
//Vue Router
import router from './router.js';
//Vue Filters
require('./filters');
//Font Awesome
require('./fontAwesome');
//Toasted Toastr Notifications
require('./notifications');
//Apollo Client / GraphQL /apolloProvider / defaultClient
const apolloProvider = require('./apolloProvider');


Vue.config.productionTip = false;

new Vue({
    //apolloProvider injects Apollo into each of our Vue Components
    apolloProvider,
    router,
    render: h => h(App)
}).$mount('#app');