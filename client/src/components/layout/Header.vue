<template>
  <nav>
    <ul id="menu">
      <li class="navigation">
        <router-link to="/" class="small">About</router-link>
      </li>
      <li class="navigation">
        <router-link to="/rhetoric/protagonistic">Pros</router-link>
      </li>
      <li class="navigation">
        <router-link to="/rhetoric/antagonistic">Cons</router-link>
      </li>

      <div class="right-nav">
        <li class="navigation">
          <router-link to="/account">
            <strong v-if="currentUser">Account</strong>
            <strong v-else>Log In</strong>
          </router-link>
        </li>
        <li v-if="!showSocial" @click="toggleSocial" class="navigation">
          <font-awesome-icon icon="share-alt-square" class="social-icons-header" />
        </li>
        <li v-else @click="toggleSocial" class="navigation">
          <font-awesome-icon icon="times-circle" class="social-icons-header" />
        </li>
      </div>
      <li v-if="showSocial" class="social-header">
        <SocialIcons />
      </li>
    </ul>
  </nav>
</template>

<script>
  import gql from 'graphql-tag';
  import SocialIcons from '../utility/SocialIcons'

  export default {
    name: "Header",
    data() {
      return {
        currentUser: null,
        showSocial: false
      }
    },
    methods: {
      toggleSocial() {
        this.showSocial = !this.showSocial;
      }
    },
    components: {
      SocialIcons
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