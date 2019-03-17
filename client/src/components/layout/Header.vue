<template>
  <header>
    <nav id="header" class="small-text">
      <li class="inline-nav">
        <router-link to="/" class="unstyled-link">about</router-link>
      </li>
      <li class="inline-nav">
        <router-link to="/arguments" class="unstyled-link">arguments</router-link>
      </li>
      <li class="inline-nav">
        <router-link to="/projects" class="unstyled-link">projects</router-link>
      </li>
      <li class="inline-nav">
        <router-link to="/leaderboards/arguments" class="unstyled-link">leaderboards</router-link>
      </li>

      <div class="right-nav">
        <li class="inline-nav">
          <router-link to="/account" class="unstyled-link">
            <strong v-if="currentUser">Account</strong>
            <strong v-else>
              Log In or Register
            </strong>
          </router-link>
        </li>

        <li v-if="!showSocial" @click="toggleSocial" class="inline-nav">
          <a>
            <font-awesome-icon icon="share-alt-square" class="social-icons-header large-text" />
          </a>
        </li>
        <li v-else @click="toggleSocial" class="inline-nav">
          <a>
            <font-awesome-icon icon="times-circle" class="social-icons-header large-text" />
          </a>
        </li>
        <li class="inline-nav">
          <router-link to="/about" class="unstyled-link">
            <font-awesome-icon icon="question" class="social-icons-header large-text" />
          </router-link>
        </li>
      </div>

      <li v-if="showSocial" class="social-dropdown">
        <a>
          <SocialIcons :currentUser="currentUser" />
        </a>
      </li>
    </nav>
  </header>
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