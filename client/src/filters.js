//Vue Import
import Vue from 'vue';

//Moment.js to format dates
import moment from 'moment';

//Adds filters to the Vue instance via this
Vue.prototype.$filters = Vue.options.filters;

/*
    Vue filters can be used in Vue Components

    To use filters in templates:
    {{ dateProperty |  formatDate }}

    In Javascript:
    this.$filters.formatDate

*/


Vue.filter('formatDate', function (value) {
    if (value) {
        let newDate = new Date(value);
        return moment(newDate.toISOString()).format('MM/DD/YYYY hh:mm')
    }
});

Vue.filter('stringifySlug', function (value) {
    return value.replace(/(-|^)([^-]?)/g, function (_, prep, letter) {
        return (prep && ' ') + letter.toUpperCase();
    });
});

Vue.filter('formatBitcoinAmount', function (value) {
    return Math.round(value*100000000);
});