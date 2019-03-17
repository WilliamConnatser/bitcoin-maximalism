<template>
  <section class="container">
    <h1 class="heading">
      <span v-if="metaSlug">{{metaSlug}}</span>
      <span v-else>projects</span>
    </h1>

    <router-link to="/projects"><button :class="filterButtonStyle()">All</button></router-link>
    <router-link to="/projects/protagonistic"><button :class="filterButtonStyle('protagonistic')">Protagonistic</button></router-link>
    <router-link to="/projects/antagonistic"><button :class="filterButtonStyle('antagonistic')">Antagonistic</button></router-link>

    <h2 v-if="$apollo.loading" class="loading">Loading...</h2>

    <ul v-else class="medium-margin-horizontal">
      <AdvancedListItem :arrayProp="this.args" v-on:update-projects-query="updateQuery"/>
    </ul>
  </section>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from '../utility/AdvancedListItem';

  export default {
    name: "Projects",
    data: () => {
      return {
        allProjects: [],
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
          return this.sortArrayByVote(this.allProjects);
        } else {
          this.forwardTo404();
        }
      },
      metaSlug() {
        return this.$route.params.metaSlug;
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
      sortArrayByVote(projectArray) {
        return projectArray.sort((a, b) => {
          return this.calculateVotes(b.votes) - this.calculateVotes(a.votes);
        });
      },
      updateQuery() {
        this.$apollo.queries.allProjects.refetch();
      },
      toggleFilter(metaSlug) {
        if (metaSlug === 'antagonistic') {
          this.$router.push({
            path: '/projects/antagonistic'
          });
        } else if (metaSlug === 'protagonistic') {
          this.$router.push({
            path: '/projects/protagonistic'
          });
        } else {
          this.$router.push({
            path: '/projects'
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
      allProjects: {
        query: gql `
            query allProjects($metaSlug: String) {
              allProjects(metaSlug: $metaSlug) {
                _id
                metaSlug
                title
                link
                description
                votes {
                  _id
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