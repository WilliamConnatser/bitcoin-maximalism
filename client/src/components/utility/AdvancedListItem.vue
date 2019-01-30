<template>
    <div>
        <li class="advanced-list-item" v-for="arrayItem in arrayProp" :key="arrayItem._id">
            <ToolbarVotes :arrayItemProp="arrayItem" :metaSlug="metaSlug" :slug="slug"/>

            <span v-if="arrayItem.__typename == 'BulletPoint'">{{arrayItem.content}}</span>
            <a v-if="arrayItem.__typename == 'Resource'" :href="arrayItem.link" class="main-link"><span class="media-type">{
                    {{arrayItem.media}} } </span>{{arrayItem.title}}</a>
            <router-link v-if="arrayItem.__typename == 'Rhetoric'" :to="urlGenerator(metaSlug, arrayItem.slug)" class="main-link">{{arrayItem.title}}</router-link>

            <ToolbarActions v-if="arrayItem.__typename !=='Rhetoric'" :arrayItemProp="arrayItem" :metaSlug="metaSlug" />
        </li>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import ToolbarVotes from '../utility/ToolbarVotes';
    import ToolbarActions from '../utility/ToolbarActions';

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
                currentUser: {},
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
            }
        }
    };
</script>