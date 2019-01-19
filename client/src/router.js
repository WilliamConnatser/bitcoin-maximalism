import Vue from "vue";
import Router from "vue-router";
import About from "./components/About.vue";
import Account from "./components/Account.vue";
import TableOfContents from "./components/TableOfContents.vue";
import Rhetoric from "./components/Rhetoric.vue";
import Signin from "./components/auth/Signin.vue";
import Signup from "./components/auth/Signup.vue";
import Terms from "./components/Terms.vue";
import Privacy from "./components/Privacy.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: About
    },
    {
      path: "/rhetoric/:metaSlug",
      component: TableOfContents
    },
    {
      path: "/rhetoric/:metaSlug/:slug",
      component: Rhetoric
    },
    {
      path: "/account",
      component: Account
    },
    {
      path: "/terms",
      component: Terms
    },
    {
      path: "/privacy",
      component: Privacy
    }
  ]
});