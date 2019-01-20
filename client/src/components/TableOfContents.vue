<template>
  <div>
    <h1>{ {{metaSlug}} }</h1>
    <AdvancedListItem :metaSlug="metaSlug" :arrayProp="this.args"/>
    <!--
      <ul class="comments">
        <li id="top" class="comment">
          <div>
            <strong class="comment-label">Top Comment</strong>
            ($100 - 0.05 BTC)
          </div>
          <strong class="comment-username">UserName:</strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus labore consequatur explicabo repellat. Porro,
          aspernatur.
        </li>
        <li id="last" class="comment">
          <div>
            <strong class="comment-label">Last Comment</strong>
            ($0.10)
            <strong class="comment-username">CoinHoarder</strong>
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit facere sit nobis quae veniam debitis?
        </li>
        <li id="random" class="comment">
          <div>
            <strong class="comment-label">Random Comment</strong>
            ($2.00)
            <strong class="comment-username">CoinHoarder</strong>
          </div>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab nemo libero voluptas minima at vel.
        </li>
      </ul>
    -->
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from './AdvancedListItem';

  export default {
    data: () => {
      return {
        getCurrentUser: null,
        getAllProtagonisticRhetoric: [],
        getAllAntagonisticRhetoric: [],
        metaSlug: ""
      }
    },
    components: {
      AdvancedListItem
    },
    created() {
      this.metaSlug = this.$route.params.metaSlug;
    },
    computed: {
      args() {
        if (this.metaSlug == "protagonistic") {
          return this.getAllProtagonisticRhetoric;
        } else {
          return this.getAllAntagonisticRhetoric;
        }
      }
    },
    watch: {
      '$route'(to, from) {
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
      getAllProtagonisticRhetoric: {
        query: gql `
                    query getAllProtagonisticRhetoric {
                        getAllProtagonisticRhetoric {
                            slug
                            title
                        }
                    }
                `
      },
      getAllAntagonisticRhetoric: {
        query: gql `
                    query getAllAntagonisticRhetoric {
                        getAllAntagonisticRhetoric {
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

  .comments {
    list-style-type: none;
  }

  .comment {
    margin: 2rem;
    padding: 2rem;
  }

  .comment-label {
    text-transform: uppercase;
  }
</style>