<template>
  <div>
    <h1 v-if="argumentSpecificRhetoric" class="title">{{argumentSpecificRhetoric.title}}</h1>
    <h1 v-if="$apollo.loading" class="loading">Loading...</h1>
    <ul>
      <AdvancedListItem v-if="argumentSpecificRhetoric" :arrayProp="concatAndSort" />
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import AdvancedListItem from '../utility/AdvancedListItem';

  export default {
    name: "Rhetoric",
    components: {
      AdvancedListItem
    },
    data() {
      return {
        currentUser: null,
        argumentSpecificRhetoric: null
      }
    },
    created() {
      if (this.$route.params.metaSlug !== "protagonistic" && this.$route.params.metaSlug !== "antagonistic") {
        this.$router.push({
          path: '/not-found'
        });
      }

      this.$root.$on('votedOnRhetoric', () => {
        this.$apollo.queries.argumentSpecificRhetoric.refetch();
      });
    },
    computed: {
      concatAndSort: function () {
        if (this.argumentSpecificRhetoric.bulletPoints && this.argumentSpecificRhetoric.resources) {
          var concatArray = this.argumentSpecificRhetoric.bulletPoints.concat(this.argumentSpecificRhetoric.resources);
          return this.sortArrayByVote(concatArray);
        } else {
          return []
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
      }
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
      },
      argumentSpecificRhetoric: {
        query: gql `
            query argumentSpecificRhetoric($metaSlug: String!, $slug: String!) {
              argumentSpecificRhetoric(metaSlug:$metaSlug, slug: $slug) {
                _id
                dateCreated
                active
                slug
                metaSlug
                title
                approved
                bulletPoints {
                    _id
                    slug
                    content
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
                resources {
                    _id
                    slug
                    title
                    media
                    link
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
            }
        `,
        variables() {
          return {
            metaSlug: this.metaSlug,
            slug: this.slug
          }
        },
        result(ApolloQueryResult, key) {
          if (!ApolloQueryResult.data.argumentSpecificRhetoric) {
            this.$router.push({
              path: '/not-found'
            });
          }
        }
      }
    }
  };
</script>