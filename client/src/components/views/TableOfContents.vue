<template>
  <div>
    <h1>{ {{metaSlug}} }</h1>

    <h1 v-if="$apollo.loading">Loading...</h1>
    <ul>
      <AdvancedListItem :arrayProp="this.args" />
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from '../utility/AdvancedListItem';

  export default {
    data: () => {
      return {
        currentUser: null,
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
        var upVotes = 0;
        var downVotes = 0
        voteArray.forEach(vote => {
          if (vote.upVotes) upVotes += vote.createdBy.accruedDonations;
          else downVotes += vote.createdBy.accruedDonations;
        });

        return upVotes + downVotes;
      },
      sortArrayByVote(rhetoricArray) {
        return rhetoricArray.sort((a, b) => {
          return this.calculateVotes(b.votes) - this.calculateVotes(a.votes);
        });
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