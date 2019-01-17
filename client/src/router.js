import Vue from "vue";
import Router from "vue-router";
import BitcoinMaximalism from "./components/BitcoinMaximalism.vue";
import Account from "./components/Account.vue";
import TableOfContents from "./components/TableOfContents.vue";
import ParentSlide from "./components/ParentSlide.vue";
import Signin from "./components/auth/Signin.vue";
import Signup from "./components/auth/Signup.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: BitcoinMaximalism
    },
    {
      path: "/rhetoric/:metaSlug",
      component: TableOfContents
    },
    {
      path: "/rhetoric/:metaSlug/:rhetoric",
      component: ParentSlide
    },
    {
      path: "/account",
      component: Account
    },
    {
      path: "/signin",
      component: Signin
    },
    {
      path: "/signup",
      component: Signup
    }
  ]
});