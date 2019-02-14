import Vue from "vue";
import Router from "vue-router";

import About from "./components/views/About.vue";
import Intro from "./components/views/Intro.vue";
import Account from "./components/views/Account.vue";
import VerifyEmail from "./components/auth/VerifyEmail.vue";
import VerifyPassword from "./components/auth/VerifyPassword.vue";
import ResetPassword from "./components/auth/ResetPassword.vue";
import TableOfContents from "./components/views/TableOfContents.vue";
import Arguments from "./components/views/Arguments.vue";
import Terms from "./components/views/Terms.vue";
import Privacy from "./components/views/Privacy.vue";
import PageNotFound from "./components/views/PageNotFound.vue";
import DonationStatus from "./components/views/DonationStatus.vue";
import SubmitDonation from "./components/views/SubmitDonation.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      component: About
    }, {
      path: "/introduction",
      component: Intro
    },
    {
      path: "/arguments",
      component: TableOfContents
    },
    {
      path: "/arguments/:metaSlug",
      component: TableOfContents
    },
    {
      path: "/arguments/:metaSlug/:slug",
      component: Arguments
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
      path: "/submit-donation",
      component: SubmitDonation
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
      path: "/verify-password/:token",
      component: VerifyPassword
    },
    {
      path: "/reset-password",
      component: ResetPassword
    },
    {
      path: "*",
      component: PageNotFound
    },
    {
      path: "/not-found",
      component: PageNotFound
    }
  ]
});