//Vue Imports
import Vue from 'vue';

//Vue-Router
import router from './router.js';

//Toasted responsive touch-compatible toastr-like notifications
import Toasted from 'vue-toasted';

//TODO: Fix Icons.. it's not liking fontawesome for some reason...

//Register the toasted plugin with Vue
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

/*
    Default notifications are injected into each Vue Component

    Can be called in vue components like:
    this.$toasted.global.log_in();

*/

Vue.toasted.register('log_in', 'You must log in or register before doing this', {
    duration: 5000,
    icon: 'fa-exclamation-circle',
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }, {
        text: 'Log in or Register',
        push: '/account'
    }]
});

Vue.toasted.register('invalid_donation_decimal', 'Donations may only contain a maximum of 8 decimal places', {
    duration: 5000,
    icon: 'fa-exclamation-circle',
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('invalid_donation_negative', 'Donations amounts may only be positive', {
    duration: 5000,
    icon: 'fa-exclamation-circle',
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('invalid_donation_numbers_only', 'Donations may only contain numbers', {
    duration: 5000,
    icon: 'fa-exclamation-circle',
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});