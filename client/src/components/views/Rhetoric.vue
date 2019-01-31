<template>
  <div>
    <h1 v-if="argumentSpecificRhetoric">{{argumentSpecificRhetoric.title}}</h1>
    <ul>
      <AdvancedListItem v-if="argumentSpecificRhetoric" :arrayProp="concatAndSort" :metaSlug="this.metaSlug" />
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
        argumentSpecificRhetoric: null,
        pro: "",
        slug: "",
        metaSlug: null
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
    computed: {
      concatAndSort: function () {
        if (this.argumentSpecificRhetoric.bulletPoints && this.argumentSpecificRhetoric.resources) {
          var result = this.argumentSpecificRhetoric.bulletPoints.concat(this.argumentSpecificRhetoric.resources);
          return result.sort((a, b) => {
            return b.accruedVotes - a.accruedVotes
          });
        } else {
          return [];
        }
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
            query argumentSpecificRhetoric($pro: Boolean!, $slug: String!) {
              argumentSpecificRhetoric(pro:$pro, slug: $slug) {
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
        },
        skip() {
          if (this.slug === ""|| this.pro === "") return true;
        }
      }
    }
  };
</script>