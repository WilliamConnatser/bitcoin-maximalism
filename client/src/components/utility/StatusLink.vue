<template>
    <router-link :to="statusLink(object)" class="small-uppercase-link">
        {{statusLink(object)}}
    </router-link>
</template>

<script>
    export default {
        name: "StatusLink",
        props: {
            object: Object
        },
        methods: {
            statusLink(object) {
                if (object.__typename === 'Rhetoric') return `/submission-status/argument/${object._id}`;
                if (object.__typename === 'Resource') return `/submission-status/resource/${object._id}`;
                if (object.__typename === 'BulletPoint') return `/submission-status/bulletpoint/${object._id}`;
                if (object.__typename === 'Project') return `/submission-status/project/${object._id}`;
                if (object.__typename === 'Donation') return `/donation-status/${object._id}`;
                else return `/404`;
            }
        }
    }
</script>