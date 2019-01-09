//Import Vue and Vuex Dependencies
import Vuex from "vuex";
import Vue from "vue";

//Import Vuex Modules
import auth from "./modules/auth";
import user from "./modules/user";
import rhetoric from "./modules/rhetoric";
import utility from "./modules/utility";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        user,
        rhetoric,
        utility
    }
});