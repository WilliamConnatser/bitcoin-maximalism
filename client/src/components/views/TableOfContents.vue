<template>
  <div>
    <h1 class="title">{ {{metaSlug}} }</h1>

    <h1 v-if="$apollo.loading" class="loading">Loading...</h1>
    <ul>
      <AdvancedListItem :arrayProp="this.args" v-on:vote-tos="updateQuery" />
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from '../utility/AdvancedListItem';

  export default {
    data: () => {
      return {
        getAllApprovedAndActiveProtagonisticRhetoric: [],
        getAllApprovedAndActiveAntagonisticRhetoric: []
      }
    },
    components: {
      AdvancedListItem
    },
    computed: {
      args() {
        if (this.metaSlug === "protagonistic") {
          return this.sortArrayByVote(this.getAllApprovedAndActiveProtagonisticRhetoric);
        } else if (this.$route.params.metaSlug === "antagonistic") {
          return this.sortArrayByVote(this.getAllApprovedAndActiveAntagonisticRhetoric);
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
        if (this.metaSlug === 'protagonistic') {
          this.$apollo.queries.getAllApprovedAndActiveProtagonisticRhetoric.refetch();
        } else {
          this.$apollo.queries.getAllApprovedAndActiveAntagonisticRhetoric.refetch();
        }
      }
    },
    apollo: {
      getAllApprovedAndActiveProtagonisticRhetoric: {
        query: gql `
            query getAllApprovedAndActiveProtagonisticRhetoric($metaSlug: String!) {
              allRhetoric(metaSlug: $metaSlug) {
                _id
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
          return {
            metaSlug: this.$route.params.metaSlug
          }
        },
        update: data => (data.allRhetoric)
      },
      getAllApprovedAndActiveAntagonisticRhetoric: {
        query: gql `
            query getAllApprovedAndActiveAntagonisticRhetoric($metaSlug: String!) {
              allRhetoric(metaSlug: $metaSlug) {
                _id
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
          return {
            metaSlug: this.$route.params.metaSlug
          }
        },
        update: data => (data.allRhetoric)
      }
    }
  }
</script>