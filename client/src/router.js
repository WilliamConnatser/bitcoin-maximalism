import Vue from "vue";
import Router from "vue-router";
import BitcoinMaximalism from "./components/BitcoinMaximalism.vue";
import Account from "./components/Account.vue";
import Signin from "./components/auth/Signin.vue";
import Signup from "./components/auth/Signup.vue";

import AuthGuard from "./AuthGuard";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "BitcoinMaximalism",
      component: BitcoinMaximalism
    },
    {
      path: "/account",
      name: "Account",
      component: Account,
      beforeEnter: AuthGuard
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    }
  ]
});