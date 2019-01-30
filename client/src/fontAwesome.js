//Vue Imports
import Vue from 'vue';

//Font Awesome
import {
    library
} from '@fortawesome/fontawesome-svg-core';

import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';

//Connect fontawesome to Vue
Vue.component('font-awesome-icon', FontAwesomeIcon);

/*

    Icons used must be imported here and added to the library below
    In distribution, it will drop all unused icons from dist to save space and bandwidth

*/

import {
    faAngleUp,
    faAngleDown,
    faComment,
    faPlusSquare,
    faMinusSquare,
    faPenSquare,
    faSearch
} from '@fortawesome/free-solid-svg-icons';


library.add(faAngleUp, faAngleDown, faComment, faPlusSquare, faMinusSquare, faPenSquare, faSearch);