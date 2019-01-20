<template>
  <div>
    <h1>{ {{metaSlug}} }</h1>
    <ul>
      <AdvancedListItem :metaSlug="metaSlug" :arrayProp="this.args"/>
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from './AdvancedListItem';

  export default {
    data: () => {
      return {
        getCurrentUser: null,
        getAllApprovedAndActiveProtagonisticRhetoric: [],
        getAllApprovedAndActiveAntagonisticRhetoric: [],
        metaSlug: "",
        slug: "",
        pro: ""
      }
    },
    components: {
      AdvancedListItem
    },
    created() {
      if (this.$route.params.metaSlug == "protagonistic") {
        this.pro = true;
      } else {
        this.pro = false;
      }

      this.metaSlug = this.$route.params.metaSlug;
      this.slug = this.$route.params.slug;
    },
    computed: {
      args() {
        if (this.metaSlug == "protagonistic") {
          return this.getAllApprovedAndActiveProtagonisticRhetoric;
        } else {
          return this.getAllApprovedAndActiveAntagonisticRhetoric;
        }
      }
    },
    watch: {
      '$route'(to, from) {
        if (to.params.metaSlug == "protagonistic") {
          this.pro = true;
        } else {
          this.pro = false;
        }
        this.slug = to.params.slug;
        this.metaSlug = to.params.metaSlug;
      }
    },
    methods: {
      vote(upvote, rhetoric) {
        this.loggedIn();
      },
      loggedIn() {
        if (!this.getCurrentUser) this.$toasted.global.log_in();
      }
    },
    apollo: {
      getCurrentUser: {
        query: gql `
                    query getCurrentUser {
                        getCurrentUser {
                            _id
                            username
                            email
                            emailValidated
                            active
                            admin
                            allegiance
                            maximalist
                        }
                    }
                `
      },
      getAllApprovedAndActiveProtagonisticRhetoric: {
        query: gql `
                    query getAllApprovedAndActiveProtagonisticRhetoric {
                        getAllApprovedAndActiveProtagonisticRhetoric {
                            slug
                            title
                        }
                    }
                `
      },
      getAllApprovedAndActiveAntagonisticRhetoric: {
        query: gql `
                    query getAllApprovedAndActiveAntagonisticRhetoric {
                        getAllApprovedAndActiveAntagonisticRhetoric {
                            slug
                            title
                        }
                    }
                `
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../sass/variables.scss";

  .toolbar-icons {
    font-size: 5rem;
    margin: 1rem;
  }


  .rhetoric {
    max-width: 100rem;
    list-style-type: none;
    font-size: 2rem;
    margin: 2rem auto;

    border: solid;
    border-color: $color-white;
    border-radius: 2rem;

    transition: all .2s;

    &:hover {
      transform: translateY(-.3rem);
      box-shadow: 0 1rem 2rem rgba($color-dark-grey, .2);

      &::after {
        transform: scaleX(1.5) scaleY(1.7);
        opacity: 0;
      }
    }

    &:active {
      transform: translateY(-.1rem);
      box-shadow: 0 .5rem 1rem rgba($color-dark-grey, .1)
    }

    .link {
      color: $color-white;
      text-transform: uppercase;
      text-decoration: none;
    }

    .toolbar {
      &>span {
        margin: 1rem;
      }
    }

    .right-toolbar {
      float: right;

      &>* {
        font-size: 2.5rem;
        margin: 0rem 1rem;
      }
    }
  }
</style>