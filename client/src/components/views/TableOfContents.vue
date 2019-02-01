<template>
  <div>
    <h1>{ {{metaSlug}} }</h1>

    <h1 v-if="$apollo.loading">Loading...</h1>
    <ul>
      <AdvancedListItem :metaSlug="metaSlug" :arrayProp="this.args" />
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
        getAllApprovedAndActiveAntagonisticRhetoric: [],
        metaSlug: "",
        slug: "",
        pro: ""
      }
    },
    components: {
      AdvancedListItem
    },
    created() {
      if (this.$route.params.metaSlug === "protagonistic") {
        this.pro = true;
      } else if (this.$route.params.metaSlug === "antagonistic") {
        this.pro = false;
      } else {
        this.$router.push({
          path: '/not-found'
        });
      }

      this.metaSlug = this.$route.params.metaSlug;
      this.slug = this.$route.params.slug;
    },
    computed: {
      args() {
        if (this.metaSlug === "protagonistic") {
          return this.getAllApprovedAndActiveProtagonisticRhetoric;
        } else if (this.$route.params.metaSlug === "antagonistic") {
          return this.getAllApprovedAndActiveAntagonisticRhetoric;
        } else {
          this.$router.push({
            path: '/not-found'
          });
        }
      }
    },
    watch: {
      '$route'(to) {
        if (to.params.metaSlug == "protagonistic") {
          this.pro = true;
        } else {
          this.pro = false;
        }
        this.slug = to.params.slug;
        this.metaSlug = to.params.metaSlug;
      }
    },
    apollo: {
      getAllApprovedAndActiveProtagonisticRhetoric: {
        query: gql `
            query getAllApprovedAndActiveProtagonisticRhetoric($pro: Boolean!) {
              allRhetoric(pro: $pro) {
                _id
                slug
                title
                accruedVotes
              }
            }
        `,
        variables: {
          pro: true
        },
        update: data => (data.allRhetoric)
      },
      getAllApprovedAndActiveAntagonisticRhetoric: {
        query: gql `
            query getAllApprovedAndActiveAntagonisticRhetoric($pro: Boolean!) {
              allRhetoric(pro: $pro) {
                _id
                slug
                title
                accruedVotes
              }
            }
        `,
        variables: {
          pro: false
        },
        update: data => (data.allRhetoric)
      }
    }
  }
</script>