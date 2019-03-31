<template>
    <div>
        <a v-if="this.viewOpinions !== null" @click="cancel('viewOpinions')" class="cursor-pointer">
            <div class="list-action-group small-text" title="Hide Opinions">
                opinions
                <div class="unstyled-link list-action-group-icon">
                    <strong class="action-count extra-small-text">X</strong>
                    <font-awesome-icon icon="comment" title="View Opinions" class="action-icon" />
                </div>
            </div>
        </a>
        <a v-else @click="show('viewOpinions'), cancel('submitOpinion')" class="cursor-pointer">
            <div class="list-action-group small-text" title="Show Opinions">
                opinions
                <div class="unstyled-link list-action-group-icon">
                    <strong class="action-count extra-small-text">{{docIDSpecificOpinionCount}}</strong>
                    <font-awesome-icon icon="comment" title="View Opinions" class="action-icon" />
                </div>
            </div>
        </a>

        <div v-if="this.viewOpinions !== null">
            <button v-if="this.submitOpinion === null" @click="show('submitOpinion')" class="cursor-pointer">
                Submit Opinion
            </button>
            <button v-if="this.submitOpinion !== null" @click="cancel('submitOpinion')" class="cursor-pointer">
                View Opinions
            </button>

            <ViewOpinions v-if="this.submitOpinion === null" :arrayItemProp="arrayItemProp" />
            <SubmitOpinions v-if="this.submitOpinion !== null" :applicableDocument="arrayItemProp" />
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import ViewOpinions from '../utility/ViewOpinions';
    import SubmitOpinions from '../utility/SubmitOpinions';

    export default {
        name: "ToolbarActions",
        props: {
            arrayItemProp: Object
        },
        components: {
            ViewOpinions,
            SubmitOpinions
        },
        data() {
            return {
                currentUser: null,
                docIDSpecificOpinionCount: 0,
                viewOpinions: null,
                submitOpinion: null,
                submitEdit: null
            }
        },
        methods: {
            cancel(actionType) {
                this[actionType] = null;
            },
            show: async function (actionType) {
                if (actionType.indexOf('submit') > -1) await this.$apollo.queries.currentUser.refetch();

                if (actionType.indexOf('submit') > -1 && !this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (actionType.indexOf('submit') > -1 && !this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else {
                    this[actionType] = true;
                }
            }
        },
        computed: {
            slug() {
                return this.arrayItemProp.slug;
            },
            metaSlug() {
                return this.arrayItemProp.metaSlug;
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
            },
            docIDSpecificOpinionCount: {
                query: gql `query docIDSpecificOpinionCount($onModel: String!, $_id: ID!) {
                        docIDSpecificOpinionCount(onModel:$onModel, _id: $_id)
                    }
                `,
                variables() {
                    return {
                        onModel: this.arrayItemProp.__typename,
                        _id: this.arrayItemProp._id
                    }
                }
            }
        }
    };
</script>