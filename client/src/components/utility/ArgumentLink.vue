<template>
    <router-link :to="argumentLink(object.metaSlug, object.slug)" class="small-uppercase-link">
        {{argumentLink(object.metaSlug,object.slug)}}
    </router-link>
</template>

<script>
    export default {
        name: "ArgumentLink",
        props: {
            object: Object
        },
        methods: {
            argumentLink(metaSlug, slug) {
                if (slug !== null) {
                    return `/arguments/${metaSlug}/${slug}`;
                } else {
                    return `/arguments/${metaSlug}`;
                }
            }
        }
    }
</script>