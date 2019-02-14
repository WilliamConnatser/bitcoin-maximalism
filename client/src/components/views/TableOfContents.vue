<template>
  <section>
    <h1 class="title">
      {
      <span v-if="metaSlug">{{metaSlug}}</span>
      <span v-else>all arguments</span>
      }
    </h1>

    <router-link to="/arguments"><button :class="filterButtonStyle()" :style="{ cursor: 'pointer'}">All</button></router-link>
    <router-link to="/arguments/protagonistic"><button :class="filterButtonStyle('protagonistic')" :style="{ cursor: 'pointer'}">Protagonistic</button></router-link>
    <router-link to="/arguments/antagonistic"><button :class="filterButtonStyle('antagonistic')" :style="{ cursor: 'pointer'}">Antagonistic</button></router-link>

    <h2 v-if="$apollo.loading" class="loading">Loading...</h2>
    <ul>
      <AdvancedListItem :arrayProp="this.args" v-on:vote-tos="updateQuery" />
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
        var cumulativeVote = 0;
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
          return "small-button selected-button";
        } else {
          return "small-button";
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
        update: data => (data.allRhetoric),
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