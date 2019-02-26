<template>
    <div class="list-submissions-toolbar medium-margin">
        <span v-if="slug === undefined" @click="show('submitRhetoric'), cancel('submitResources'), cancel('submitBulletPoints')"
            class="small-text icon-group cursor-pointer">
            <font-awesome-icon icon="plus-square"></font-awesome-icon>
            <span>argument</span>
        </span>
        <span v-if="slug !== undefined" @click="show('submitBulletPoints'), cancel('submitResources'), cancel('submitRhetoric')"
            class="small-text icon-group cursor-pointer">
            <font-awesome-icon icon="plus-square"></font-awesome-icon>
            <span>bulletpoint</span>
        </span>
        <span v-if="slug !== undefined" @click="show('submitResources'), cancel('submitBulletPoints'), cancel('submitRhetoric')"
            class="small-text icon-group cursor-pointer">
            <font-awesome-icon icon="plus-square"></font-awesome-icon>
            <span>resource</span>
        </span>

        <SubmitRhetoric v-if="submitRhetoric" :arrayItemProp="applicableObject" />
        <SubmitResources v-if="submitResources" :arrayItemProp="applicableObject" />
        <SubmitBulletPoints v-if="submitBulletPoints" :arrayItemProp="applicableObject" />
    </div>
</template>

<script>
    import gql from 'graphql-tag';
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
            SubmitResources
        },
        data() {
            return {
                currentUser: null,
                submitBulletPoints: false,
                submitResources: false,
                submitRhetoric: false
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
                    if(!this[actionType]) {
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