import Vue from "vue";
import VueRouter from "vue-router";

import About from "./components/views/About.vue";
import Account from "./components/views/Account.vue";
import VerifyEmail from "./components/auth/VerifyEmail.vue";
import TableOfContents from "./components/views/TableOfContents.vue";
import Rhetoric from "./components/views/Rhetoric.vue";
import Activity from "./components/views/Activity.vue";
import Terms from "./components/views/Terms.vue";
import Privacy from "./components/views/Privacy.vue";
import PageNotFound from "./components/views/PageNotFound.vue"
import DonationStatus from "./components/views/DonationStatus.vue"

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
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
    },
    {
      path: "/activity",
      component: Activity
    },
    {
      path: "/donation-status/:_id",
      component: DonationStatus
    },
    {
      path: "/verify-email/:token",
      component: VerifyEmail
    },
    {
      path: "*",
      component: PageNotFound
    }
  ]
});