<template>
    <div >
        <a class="fancy-link list-action-toolbar cursor-pointer">
            <strong v-if="this.viewOpinions !== null" @click="cancel('viewOpinions')" class="action-count extra-small-text">X</strong>
            <strong v-else @click="show('viewOpinions'), cancel('viewEdits'), cancel('submitOpinion')" class="action-count extra-small-text">{{docIDSpecificOpinionCount}}</strong>
            <font-awesome-icon icon="comment" title="View Opinions" class="action-icon" />
        </a>

        <!--
            <div class="action-icon-group">
                <strong v-if="this.viewEdits !== null" @click="cancel('viewEdits')" class="action-count extra-small-text">X</strong>
                <strong v-else @click="show('viewEdits'), cancel('viewOpinions'), cancel('submitEdit')" class="action-count extra-small-text">{{docIDSpecificOpinionCount}}</strong>
                <font-awesome-icon v-if="this.viewEdits === null" icon="pen-square" title="View Edits" class="action-icon" />
                <font-awesome-icon v-else icon="square" title="View Edits" class="action-icon" />
            </div>
            -->

        <div v-if="this.viewOpinions !== null">
            <a><button v-if="this.submitOpinion === null" @click="show('submitOpinion')" class="cursor-pointer">Submit Opinion</button></a>
            <a><button v-if="this.submitOpinion !== null" @click="cancel('submitOpinion')" class="cursor-pointer">View Opinions</button></a>

            <ViewOpinions v-if="this.submitOpinion === null" :arrayItemProp="arrayItemProp" />
            <SubmitOpinions v-if="this.submitOpinion !== null" :arrayItemProp="arrayItemProp" />
        </div>
        <!--
            <div v-if="this.viewEdits !== null">
                <h2>Suggest an Edit</h2>
                <button v-if="this.submitEdit === null" @click="show('submitEdit')">Submit Edit</button>
                <button v-if="this.submitEdit !== null" @click="cancel('submitEdit')">View Edits</button>

                <ViewEdits v-if="this.submitEdit === null" :arrayItemProp="arrayItemProp" :metaSlug="metaSlug" />
                <SubmitEdits v-if="this.submitEdit !== null" :arrayItemProp="arrayItemProp" :metaSlug="metaSlug" />
            </div>
            -->
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import ViewOpinions from '../utility/ViewOpinions';
    import ViewEdits from '../utility/ViewEdits';
    import SubmitOpinions from '../utility/SubmitOpinions';
    import SubmitEdits from '../utility/SubmitEdits';

    export default {
        name: "ToolbarActions",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                docIDSpecificOpinionCount: 0,
                viewOpinions: null,
                viewEdits: null,
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
        components: {
            ViewOpinions,
            ViewEdits,
            SubmitOpinions,
            SubmitEdits
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