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
    faSquare,
    faPlusSquare,
    faMinusSquare,
    faCheckSquare,
    faPenSquare,
    faSearch,
    faEnvelopeSquare,
    faSms,
    faShareAltSquare,
    faTimesCircle,
    faExclamationCircle,
    faSortAmountUp,
    faSortAmountDown
} from '@fortawesome/free-solid-svg-icons';

import {
    faFacebookSquare,
    faTwitterSquare,
    faRedditSquare,
    faTelegram,
    faWeibo,
    faGithubSquare
} from '@fortawesome/free-brands-svg-icons';


library.add(faAngleUp, faAngleDown, faComment, faSquare, faPlusSquare, faMinusSquare, faCheckSquare, faPenSquare, faSearch, faEnvelopeSquare, faTimesCircle, faExclamationCircle, faSortAmountUp, faSortAmountDown, faFacebookSquare, faTwitterSquare, faRedditSquare, faTelegram, faWeibo, faSms, faGithubSquare, faShareAltSquare);