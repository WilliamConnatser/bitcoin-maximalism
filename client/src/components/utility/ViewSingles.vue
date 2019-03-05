<template>
    <div class="apollo-response">
        <ul v-if="singleDocument && singleDocument.__typename === 'Opinion'">
            <li class="opinion">
                <div>
                    <ToolbarVotes :arrayItemProp="singleDocument" />
                    <strong class="uppercase">{{singleDocument.createdBy.username}}</strong>
                    {{singleDocument.dateCreated | formatDate }}
                </div>
                <div>
                    {{singleDocument.opinion}}
                </div>

                <router-link :to="urlGenerator(singleDocument.metaSlug, singleDocument.slug)">
                    {{urlGenerator(singleDocument.metaSlug, singleDocument.slug)}}
                </router-link>
            </li>
        </ul>

        <ul v-if="singleDocument && (singleDocument.__typename === 'Rhetoric' || singleDocument.__typename === 'Resource' || singleDocument.__typename === 'BulletPoint')">
            <li class="list">
                <ToolbarVotes :arrayItemProp="singleDocument" />

                <span v-if="singleDocument.__typename == 'BulletPoint'" >{{singleDocument.content}}</span>
                <a v-if="singleDocument.__typename == 'Resource'" :href="singleDocument.link" class="fancy-link "><span
                        class="media-type">{
                        {{singleDocument.media}} } </span>{{singleDocument.title}}</a>
                <router-link v-if="singleDocument.__typename == 'Rhetoric'" :to="urlGenerator(singleDocument.metaSlug, singleDocument.slug)"
                    class="fancy-link ">{{singleDocument.title}}</router-link>

                <ToolbarActions :arrayItemProp="singleDocument"/>
            </li>
        </ul>
    </div>
</template>

<script>
    import ToolbarVotes from './ToolbarVotes';
    import ToolbarActions from './ToolbarActions';

    export default {
        name: "ViewSingles",
        props: {
            singleDocument: Object
        },
        components: {
            ToolbarVotes,
            ToolbarActions
        },
        data() {
            return {

            }
        },
        methods: {
            urlGenerator(metaSlug, slug) {
                if (slug !== null) {
                    return `/arguments/${metaSlug}/${slug}`;
                } else {
                    return `/arguments/${metaSlug}`;
                }
            }
        }
    };
</script>