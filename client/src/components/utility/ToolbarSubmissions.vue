<template>
    <div class="list-submissions-toolbar">
        <span v-if="this.$route.fullPath.includes('projects')" @click="show('submitProjects')"
            class="small-text icon-group cursor-pointer">
            <font-awesome-icon v-if="!submitProjects" icon="plus-square" class="large-icon" title="Submit A Project" />
            <font-awesome-icon v-else icon="minus-square" class="large-icon" />
            <span>project</span>
        </span>
        <span v-if="slug === undefined && !this.$route.fullPath.includes('projects')" @click="show('submitRhetoric')"
            class="small-text icon-group cursor-pointer">
            <font-awesome-icon v-if="!submitRhetoric" icon="plus-square" class="large-icon" title="Submit An Argument"/>
            <font-awesome-icon v-else icon="minus-square" class="large-icon" />
            <span>argument</span>
        </span>
        <span v-if="slug !== undefined" @click="show('submitBulletPoints'), cancel('submitResources'), cancel('submitRhetoric')"
            class="small-text icon-group cursor-pointer">
            <font-awesome-icon v-if="!submitBulletPoints" icon="plus-square" class="large-icon" title="Submit A Bulletpoint" />
            <font-awesome-icon v-else icon="minus-square" class="large-icon" />
            <span>bulletpoint</span>
        </span>
        <span v-if="slug !== undefined" @click="show('submitResources'), cancel('submitBulletPoints'), cancel('submitRhetoric')"
            class="small-text icon-group cursor-pointer">
            <font-awesome-icon v-if="!submitResources" icon="plus-square" class="large-icon" title="Submit A Resource"/>
            <font-awesome-icon v-else icon="minus-square" class="large-icon" />
            <span>resource</span>
        </span>

        <SubmitProjects v-if="submitProjects" class="submission-form" />
        <SubmitRhetoric v-if="submitRhetoric" class="submission-form" />
        <SubmitResources v-if="submitResources" class="submission-form" />
        <SubmitBulletPoints v-if="submitBulletPoints" class="submission-form" />

    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import SubmitProjects from '../utility/SubmitProjects';
    import SubmitRhetoric from '../utility/SubmitRhetoric';
    import SubmitBulletPoints from '../utility/SubmitBulletPoints';
    import SubmitResources from '../utility/SubmitResources';

    export default {
        name: "ToolbarSubmissions",
        props: {
            applicableObject: Object
        },
        components: {
            SubmitRhetoric,
            SubmitBulletPoints,
            SubmitResources,
            SubmitProjects
        },
        data() {
            return {
                currentUser: null,
                submitBulletPoints: false,
                submitResources: false,
                submitRhetoric: false,
                submitProjects: false
            }
        },
        methods: {
            cancel(actionType) {
                this[actionType] = null;
            },
            show: async function (actionType) {

                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else {
                    if (!this[actionType]) {
                        this[actionType] = true;
                    } else {
                        this[actionType] = false;
                    }
                }
            }
        },
        computed: {
            slug() {
                return this.$route.params.slug;
            },
            metaSlug() {
                return this.$route.params.metaSlug;
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