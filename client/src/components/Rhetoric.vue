<template>
  <div>
    <h1>{{getRhetoricByMetaSlugAndSlug.title}}</h1>
    <ul>
      <li class="rhetoric" v-for="bulletPoint in getRhetoricByMetaSlugAndSlug.bulletPoints" :key="bulletPoint.content">
        <div class="toolbar--top">
          <span @click='vote(true, bulletPoint)' title="Upvote">
            <font-awesome-icon icon="angle-up" />
          </span>
          <span class="amount-donated">
            ${{bulletPoint.amountDonated}}
          </span>
          <span @click='vote(false, bulletPoint)' title="Downvote">
            <font-awesome-icon icon="angle-down" />
          </span>
        </div>
        {{bulletPoint.content}}
        <div class="toolbar--bottom">
          <font-awesome-icon class="toolbar-icons" icon="comment-dollar" title="Comment">Comment</font-awesome-icon>
          <font-awesome-icon class="toolbar-icons" icon="pen-square" title="Submit Edit" />
          <font-awesome-icon class="toolbar-icons" icon="minus-square" title="Remove Argument" />
        </div>
      </li>

      <li class="rhetoric" v-for="resource in getRhetoricByMetaSlugAndSlug.resources" :key="resource.link">
        <div class="toolbar">
          <span @click='vote(true, resource)' title="Upvote">
            <font-awesome-icon icon="angle-up" />
          </span>
          <span class="amountDonated">
            ${{resource.amountDonated}}
          </span>
          <span @click='vote(false, resource)' title="Downvote">
            <font-awesome-icon icon="angle-down" />
          </span>
          <!--
          <i class="right-toolbar">
            <font-awesome-icon class="toolbar-icons" icon="comment-dollar" title="Comment" />
            <font-awesome-icon class="toolbar-icons" icon="minus-square" title="Remove Resource" />
          </i>
          -->
        </div>
        <a :href="resource.link">{{resource.title}} <span class="media-type">({{resource.media}})</span></a>
      </li>
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: "Rhetoric",
    data() {
      return {
        getCurrentUser: {},
        getRhetoricByMetaSlugAndSlug: {},
        pro: "",
        slug: ""
      }
    },
    created() {
      if (this.$route.params.metaSlug == "protagonistic") {
        this.pro = true;
      } else {
        this.pro = false;
      }
      this.slug = this.$route.params.slug;
    },
    watch: {
      '$route'(to, from) {
        if (to.params.metaSlug == "protagonistic") {
          this.pro = true;
        } else {
          this.pro = false;
        }
        this.slug = to.params.slug;
      }
    },
    methods: {
      vote(upvote, rhetoric) {
        this.loggedIn();
      },
      loggedIn() {
        if (!this.getCurrentUser) this.$toasted.global.log_in();
      }
    },
    apollo: {
      getCurrentUser: {
        query: gql `
                    query getCurrentUser {
                        getCurrentUser {
                            _id
                            username
                            email
                            emailValidated
                            active
                            admin
                            allegiance
                            maximalist
                        }
                    }
                `
      },
      getRhetoricByMetaSlugAndSlug: {
        query: gql `
                    query getRhetoricByMetaSlugAndSlug($pro: Boolean!, $slug: String!) {
                      getRhetoricByMetaSlugAndSlug(pro:$pro, slug: $slug) {
                        _id
                        dateCreated
                        active
                        slug
                        pro
                        title
                        approved
                        bulletPoints {
                            _id
                            active
                            slug
                            pro
                            content
                            approved
                        }
                        resources {
                            _id
                            slug
                            pro
                            title
                            media
                            link
                            approved
                        }
                        opinions {
                            _id
                            dateCreated
                            slug
                            pro                              
                            comment
                            approved
                        }
                        edits {
                            _id
                            dateCreated
                            slug
                            pro
                        }
                        donations {
                            _id
                            slug
                            pro
                            ticker
                            amount
                            username
                        }  
                      }
                    }
                `,
        variables() {
          return {
            pro: this.pro,
            slug: this.slug
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../sass/variables.scss";

  .rhetoric {
    max-width: 100rem;
    list-style-type: none;
    font-size: 2rem;
    margin: 2rem auto;

    border: solid;
    border-color: $color-white;
    border-radius: 2rem;

    transition: all .2s;

    &:hover {
      transform: translateY(-.3rem);
      box-shadow: 0 1rem 2rem rgba($color-dark-grey, .2);

      &::after {
        transform: scaleX(1.5) scaleY(1.7);
        opacity: 0;
      }
    }

    &:active {
      transform: translateY(-.1rem);
      box-shadow: 0 .5rem 1rem rgba($color-dark-grey, .1)
    }

    a {
      color: $color-white;
      text-transform: uppercase;
      text-decoration: none;
    }

    .toolbar {
      &--top {
        &>span {
          margin: 1rem;
        }
      }

      &--bottom {
        &>* {
          font-size: 3rem;
          font-weight: 600;
          margin: 1rem 2rem;
        }
      }
    }
  }
</style>