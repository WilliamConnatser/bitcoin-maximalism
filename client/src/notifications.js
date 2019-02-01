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
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
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
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
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

Vue.toasted.register('invalid_donation_minimum', 'Donations must be more than $1', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('invalid_donation_leading_zeros', 'There can only be one leading zero', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('invalid_donation_decimal', 'Donations may only contain a maximum of 8 decimal places', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('invalid_donation_negative', 'Donations amounts may only be positive', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('invalid_donation_nonzero', 'Donations must be a non-zero number', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('invalid_donation_numbers_only', 'Donations may only contain numbers', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('email', 'Enter an email', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('password', 'Enter a password', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('accept_tos_privacy', 'By using this website you are agreeing to our Terms of Service and Privacy Policy.', {
    duration: null,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [
        {
            text: 'Terms of Service',
            push: '/terms'
        },
        {
            text: 'Privacy Policy',
            push: '/privacy'
        },
        {
            text: 'Agreed',
            onClick: (e, toastObject) => {
                toastObject.goAway(0);
            }
        }
    ]
});