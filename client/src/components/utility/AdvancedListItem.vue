<template>
    <div>
        <li class="list" v-for="arrayItem in arrayProp" :key="arrayItem._id">
            <ToolbarVotes :arrayItemProp="arrayItem" />

            <span v-if="arrayItem.__typename == 'BulletPoint'" class="normal-text">{{arrayItem.content}}</span>
            <a v-if="arrayItem.__typename == 'Resource'" :href="arrayItem.link" class="fancy-link normal-text"><span
                    class="media-type">{
                    {{arrayItem.media}} } </span>{{arrayItem.title}}</a>
            <router-link v-if="arrayItem.__typename == 'Rhetoric'" :to="urlGenerator(metaSlug, arrayItem.slug)" class="fancy-link normal-text">{{arrayItem.title}}</router-link>

            <ToolbarActions :arrayItemProp="arrayItem" />
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
            arrayProp: Array
        },
        components: {
            ToolbarVotes,
            ToolbarActions
        },
        computed: {
            metaSlug() {
                return this.$route.params.metaSlug;
            }
        },
        methods: {
            urlGenerator: (metaSlug, slug) => {
                return `${metaSlug}/${slug}`
            }
        }
    };
</script>