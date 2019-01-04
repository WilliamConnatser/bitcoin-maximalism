//Import Vue and Vuex Dependencies
import Vuex from "vuex";
import Vue from "vue";

//Import Vuex Modules
import rhetoric from "./modules/rhetoric";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        rhetoric
    }
});