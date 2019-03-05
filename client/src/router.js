import Vue from "vue";
import Router from "vue-router";

import Leaderboards from "./components/views/Leaderboards.vue";
import About from "./components/views/About.vue";
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
import SubmissionStatus from "./components/views/SubmissionStatus.vue";
//import Maintenance from "./components/views/Maintenance.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [/*{
    path: "*",
    component: Maintenance
  }*/
    {
      path: "/",
      component: About
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
      path: "/leaderboards",
      component: Leaderboards
    },
    {
      path: "/leaderboards/:leaderboardsCategory",
      component: Leaderboards
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
      path: "/submission-status/:documentType/:documentID",
      component: SubmissionStatus
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
      path: "/sitemap.xml"
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