<template>
  <ul id="menu">
    <li>
      <router-link to="/" class="small">About</router-link>
    </li>
    <li>
      <router-link to="/rhetoric/protagonistic">Pros</router-link>
    </li>
    <li>
      <router-link to="/rhetoric/antagonistic">Cons</router-link>
    </li>
    <!--
    <li>
      <router-link to="/activity">Activity</router-link>
    </li>
    -->

    <div class="right-nav">
      <li>
        <router-link to="/account">
          <strong v-if="currentUser">Account</strong>
          <strong v-else>Log In</strong>
        </router-link>        
      </li>
    </div>
  </ul>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: "Header",
    data() {
      return {
        currentUser: null
      }
    },
    apollo: {
      currentUser: {
        query: gql `
                    query currentUser {
                        currentUser {
                            _id
                            username
                            email
                            emailVerified
                            active
                            admin
                        }
                    }
                `
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../sass/variables";

  #menu {
    text-align: left;
    min-height: $header-minimum-height;
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