<template>
    <div>
        <li class="advanced-list-item" v-for="arrayItem in arrayProp" :key="arrayItem._id">
            <ToolbarVotes :arrayItemProp="arrayItem" :metaSlug="metaSlug" />

            <span v-if="arrayItem.__typename == 'BulletPoint'">{{arrayItem.content}}</span>
            <a v-if="arrayItem.__typename == 'Resource'" :href="arrayItem.link"><span class="media-type">{
                    {{arrayItem.media}} } </span>{{arrayItem.title}}</a>
            <router-link v-if="arrayItem.__typename == 'Rhetoric'" class="link" :to="urlGenerator(metaSlug, arrayItem.slug)">{{arrayItem.title}}</router-link>

            <ToolbarActions :arrayItemProp="arrayItem" :metaSlug="metaSlug" />
        </li>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import ToolbarVotes from './ToolbarVotes';
    import ToolbarActions from './ToolbarActions';

    export default {
        name: "AdvancedListItem",
        props: {
            arrayProp: Array,
            metaSlug: String
        },
        components: {
            ToolbarVotes,
            ToolbarActions
        },
        data() {
            return {
                getCurrentUser: {},
                getRhetoricByMetaSlugAndSlug: {},
                slug: ""
            }
        },
        created() {
            this.slug = this.$route.params.slug;
        },
        watch: {
            '$route'(to, from) {
                this.slug = to.params.slug;
            }
        },
        methods: {
            urlGenerator: (metaSlug, slug) => {
                return `${metaSlug}/${slug}`
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
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .advanced-list-item {
        max-width: 100rem;
        list-style-type: none;
        font-size: 2rem;
        margin: 2rem auto;
        padding: 0rem .5rem;

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

            .media-type {
                font-weight: 500;

                &::after {
                    content: '\A';
                    white-space: pre;
                }
            }
        }
    }
</style>