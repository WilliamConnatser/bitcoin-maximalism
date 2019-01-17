<template>
  <div>
    <h1>{ {{metaSlug}} }</h1>

    <div class="tos-toolbar">
      <font-awesome-icon class="tos-toolbar-icons" icon="comment-dollar" title="Comment" />
      <font-awesome-icon class="tos-toolbar-icons" icon="plus-square" title="Submit New Argument" />
    </div>

    <ul>
      <li class="rhetoric" v-for="arg in args" :key="arg.slug">
        <ul class="vote-container">
          <li id="arg.slug" class="vote up-vote" title="Upvote">
            <font-awesome-icon icon="angle-up" />
          </li>
          <li id="arg.slug" class="vote down-vote" title="Downvote">
            <font-awesome-icon icon="angle-down" />
          </li>
        </ul>
        <a :href="urlGenerator(metaSlug, arg.slug)">{{arg.title}}</a>
      </li>
    </ul>

    <ul>
      <li id="top" class="comment">
        <div>
          <strong class="comment-label">Top Comment</strong>
          ($100)
          <span class="comment-username">CoinHoarder</span>
        </div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus labore consequatur explicabo repellat. Porro,
        aspernatur.
      </li>
      <li id="last" class="comment">
        <div>
          <strong class="comment-label">Last Comment</strong>
          ($0.10)
          <span class="comment-username">CoinHoarder</span>
        </div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit facere sit nobis quae veniam debitis?
      </li>
      <li id="random" class="comment">
        <div>
          <strong class="comment-label">Random Comment</strong>
          ($2.00)
          <span class="comment-username">CoinHoarder</span>
        </div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab nemo libero voluptas minima at vel.
      </li>
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    data: () => {
      return {
        getAllProtagonisticRhetoric: [],
        getAllAntagonisticRhetoric: [],
        metaSlug: ""
      }
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
      urlGenerator: (metaSlug, slug) => {
        return `${metaSlug}/${slug}`
      }
    },
    apollo: {
      getAllProtagonisticRhetoric: {
        query: gql `
                    query getAllProtagonisticRhetoric($approved: Boolean) {
                        getAllProtagonisticRhetoric(approved: $approved) {
                            slug
                            title  
                        }
                    }
                `,
        variables: {
          approved: true
        }
      },
      getAllAntagonisticRhetoric: {
        query: gql `
                    query getAllAntagonisticRhetoric($approved: Boolean) {
                        getAllAntagonisticRhetoric(approved: $approved) {
                            slug
                            title
                        }
                    }
                `,
        variables: {
          approved: true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../sass/variables.scss";

  .vote {
    color: $color-primary;
    font-size: 3rem;
    padding: 0;
    float: right;
  }

  ul {
    list-style-type: none;
    padding: 0rem 2rem;
    text-align: left;
  }

  li {
    position: relative;
    margin: .5rem .5rem;
    background-color: $color-tertiary;
  }

  a {
    color: $color-white;
    text-transform: uppercase;
    font-size: 1.25rem;
    text-decoration: none;

    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  a:hover {
    text-decoration: underline;
  }

  .vote-container {
    display: inline-block;
  }

  .tos-toolbar {
    font-size: 5rem;
  }

  .tos-toolbar-icons {
    margin: 1rem;
    ;
  }

  .comment-label {
    color: $color-primary;
    text-transform: uppercase;
  }

  .comment-username {
    color: $color-beige;
    float: right;
  }
</style>