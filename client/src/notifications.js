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

Vue.toasted.register('verify_email', 'Verify your email first.', {
    duration: 5000,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [{
        text: 'Request Email',
        push: '/verify-email/null'
    },{
        text: 'Close',
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    }]
});

Vue.toasted.register('accept_tos_privacy', 'Like cookies? By continuing you are agreeing to both:', {
    duration: null,
    position: 'bottom-center',
    fullWidth: true,
    fitToScreen: true,
    singleton: true,
    action: [
        {
            text: 'Our Terms',
            push: '/terms'
        },
        {
            text: 'Our Privacy Policy',
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