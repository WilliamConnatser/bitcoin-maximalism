<template>
  <ul id="menu">
    <li><router-link to="/" class="small">Intro</router-link></li>
    <li><router-link to="/rhetoric/protagonistic">Pros</router-link></li>
    <li><router-link to="/rhetoric/antagonistic">Cons</router-link></li>
    <li><router-link to="scoreboard">Scoreboard</router-link></li>

    <div class="right-nav">
      <li id="signOut" v-if="user" @click="signoutUser"><a to="#">Signout</a></li>
      <li>
        <router-link to="account">
          <strong v-if="user">Account</strong>
          <strong v-else>Log In</strong>
        </router-link>
      </li>
    </div>
  </ul>
</template>

<script>
  //Import Apollo Client
  import {
    defaultClient as apolloClient
  } from '../main';

  export default {
    name: "Header",
    methods: {
      signoutUser: async () => {
        //Remove token in localStorage
        localStorage.setItem("token", "");
        //End Apollo Client Session
        await apolloClient.resetStore();
      }
    },
    props: [
      'user'
    ]
  };
</script>

<style lang="scss" scoped>
  @import "../sass/variables";

  ul {
    padding-right: 10vw;
    height: 4vh;
    background-image: linear-gradient(to right bottom,
      hsla(196, 31%, 33%, .7),
      hsla(68, 16%, 62%, .7)),
      url(../../public/images/header-bg.jpg);
    background-size: cover;
    background-position: bottom;

    list-style-type: none;
  }

  li {
    display: inline-block;
    padding: 0rem .5rem;
  }

  a {
    color: $color-white;
    text-transform: uppercase;
    font-size: 1.5rem;
    text-decoration: none;
  }

  .right-nav {
    position: absolute;
    right: 0;
    top: 0;
  }
</style>