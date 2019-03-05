<template>
  <section class="container">
    <h1 class="heading">
      <span v-if="metaSlug">{{metaSlug}}</span>
      <span v-else>arguments</span>
    </h1>

    <router-link to="/arguments"><button :class="filterButtonStyle()">All</button></router-link>
    <router-link to="/arguments/protagonistic"><button :class="filterButtonStyle('protagonistic')">Protagonistic</button></router-link>
    <router-link to="/arguments/antagonistic"><button :class="filterButtonStyle('antagonistic')">Antagonistic</button></router-link>

    <h2 v-if="$apollo.loading" class="loading">Loading...</h2>

    <ul v-else class="medium-margin-horizontal">
      <AdvancedListItem :arrayProp="this.args" v-on:update-tos-query="updateQuery" />
    </ul>
  </section>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from '../utility/AdvancedListItem';

  export default {
    data: () => {
      return {
        allRhetoric: [],
      }
    },
    components: {
      AdvancedListItem
    },
    computed: {
      args() {
        if (this.metaSlug === "protagonistic" ||
          this.$route.params.metaSlug === "antagonistic" ||
          !this.metaSlug) {
          return this.sortArrayByVote(this.allRhetoric);
        } else {
          this.forwardTo404();
        }
      },
      metaSlug() {
        return this.$route.params.metaSlug;
      },
      slug() {
        return this.$route.params.slug;
      }
    },
    methods: {
      forwardTo404() {
        this.$router.push({
          path: '/not-found'
        });
      },
      calculateVotes(voteArray) {
        let cumulativeVote = 0;
        voteArray.forEach(vote => {
          if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
          else cumulativeVote -= vote.createdBy.accruedDonations;
        });
        return cumulativeVote;
      },
      sortArrayByVote(rhetoricArray) {
        return rhetoricArray.sort((a, b) => {
          return this.calculateVotes(b.votes) - this.calculateVotes(a.votes);
        });
      },
      updateQuery() {
        this.$apollo.queries.allRhetoric.refetch();
      },
      toggleFilter(metaSlug) {
        if (metaSlug === 'antagonistic') {
          this.$router.push({
            path: '/arguments/antagonistic'
          });
        } else if (metaSlug === 'protagonistic') {
          this.$router.push({
            path: '/arguments/protagonistic'
          });
        } else {
          this.$router.push({
            path: '/arguments'
          });
        }
      },
      filterButtonStyle(metaSlug) {
        if (metaSlug === this.metaSlug) {
          return "small-button selected-button cursor-pointer";
        } else {
          return "small-button cursor-pointer";
        }
      }
    },
    apollo: {
      allRhetoric: {
        query: gql `
            query allRhetoric($metaSlug: String) {
              allRhetoric(metaSlug: $metaSlug) {
                _id
                metaSlug
                slug
                title
                votes {
                  _id
                  dateCreated
                  upVote
                  createdBy {
                    _id
                    username
                    accruedDonations
                  }
                }
              }
            }
        `,
        variables() {
          if (this.metaSlug) {
            return {
              metaSlug: this.metaSlug
            }
          }
        },
        skip() {
          if (this.metaSlug === "protagonistic" ||
            this.metaSlug === "antagonistic" ||
            !this.metaSlug) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }
</script>