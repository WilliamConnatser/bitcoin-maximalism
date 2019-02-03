<template>
  <div>
    <h1 v-if="argumentSpecificRhetoric">{{argumentSpecificRhetoric.title}}</h1>
    <h1 v-if="$apollo.loading">Loading...</h1>
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
      if (this.$route.params.metaSlug == !"protagonistic" && this.$route.params.metaSlug !== "antagonistic") {
        this.$router.push({
          path: '/not-found'
        });
      }
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
                      createdBy {
                        _id
                        username
                        accruedDonations
                      }
                    }
                }
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