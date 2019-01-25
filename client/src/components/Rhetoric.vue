<template>
  <div>
    <h1>{{getRhetoricByMetaSlugAndSlug.title}}</h1>
    <ul>
      <AdvancedListItem :arrayProp="getRhetoricByMetaSlugAndSlug.bulletPoints" :metaSlug="this.metaSlug"/>
      <AdvancedListItem :arrayProp="getRhetoricByMetaSlugAndSlug.resources" :metaSlug="this.metaSlug"/>
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from './AdvancedListItem';

  export default {
    name: "Rhetoric",
    components: {
      AdvancedListItem
    },
    data() {
      return {
        getCurrentUser: {},
        getRhetoricByMetaSlugAndSlug: {},
        pro: "",
        slug: "",
        metaSlug: ""
      }
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
    watch: {
      '$route'(to, from) {
        if (to.params.metaSlug == "protagonistic") {
          this.pro = true;
        } else {
          this.pro = false;
        }
        this.metaSlug = this.$route.params.metaSlug;
        this.slug = to.params.slug;
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
      getRhetoricByMetaSlugAndSlug: {
        query: gql `
                    query getRhetoricByMetaSlugAndSlug($pro: Boolean!, $slug: String!) {
                      getRhetoricByMetaSlugAndSlug(pro:$pro, slug: $slug) {
                        _id
                        dateCreated
                        active
                        slug
                        pro
                        title
                        approved
                        accruedVotes
                        bulletPoints {
                            _id
                            slug
                            content
                            accruedVotes
                        }
                        resources {
                            _id
                            slug
                            title
                            media
                            link
                            accruedVotes
                        }
                      }
                    }
                `,
        variables() {
          return {
            pro: this.pro,
            slug: this.slug
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../sass/variables.scss";

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

    a {
      color: $color-white;
      text-transform: uppercase;
      text-decoration: none;
    }

    .toolbar {
      &--top {
        &>span {
          margin: 1rem;
        }
      }

      &--bottom {
        &>* {
          font-size: 3rem;
          font-weight: 600;
          margin: 1rem 2rem;
        }
      }
    }
  }
</style>