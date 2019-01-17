<template>
  <ul id="menu">
    <li><a href="bitcoin-maximalism" class="small">Intro</a></li>
    <li><a href="protagonistic">Pros</a></li>
    <li><a href="antagonistic">Cons</a></li>
    <li><a href="quiz">Quiz</a></li>

    <div class="right-nav">
      <li id="signOut" v-if="user" @click="signoutUser"><a href="#">Signout</a></li>
      <li>
        <a href="account">
          <strong v-if="user">Account</strong>
          <strong v-else>Log In</strong>
        </a>
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
    position: absolute;
    top: 0;
    width: 100%;
    height: 8vh;
    margin: 0;
    padding: 0;
    z-index: 30;

    background-image: linear-gradient(to right bottom,
      hsla(196, 31%, 33%, .8),
      hsla(68, 16%, 62%, .8)),
      url(../../public/images/header-bg.jpg);
    background-size: cover;
    background-position: bottom;

    list-style-type: none;
  }

  li {
    display: inline-block;
    padding: 0rem 1rem;
  }

  a {
    color: $color-white;
    text-transform: uppercase;
    font-size: 1.5rem;
    text-decoration: none;
  }

  .right-nav {
    float: right;
  }
</style>