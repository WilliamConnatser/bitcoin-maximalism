<template>
    <div>
        <div class="action-icons">
            <font-awesome-icon @click="show('viewOpinions'), cancel('viewEdits')" icon="comment" title="View Opinions" />
            <font-awesome-icon @click="show('viewEdits'), cancel('viewOpinions')" icon="pen-square" title="View Edits" />
        </div>

        <div v-if="this.viewOpinions !== null">
            <button @click="cancel('viewOpinions')">Hide Opinions</button>
            <button v-if="this.submitOpinion === null" @click="show('submitOpinion')">Submit Opinion</button>
            <button v-if="this.submitOpinion !== null" @click="cancel('submitOpinion')">View Opinions</button>

            <ViewOpinions v-if="this.submitOpinion === null" :arrayItemProp="arrayItemProp" />
            <SubmitOpinions v-if="this.submitOpinion !== null" :arrayItemProp="arrayItemProp"/>
        </div>
        
        <div v-if="this.viewEdits !== null">
            <h2>Suggest an Edit</h2>
            <button @click="cancel('viewEdits')">Hide Edits</button>
            <button v-if="this.submitEdit === null" @click="show('submitEdit')">Submit Edit</button>
            <button v-if="this.submitEdit !== null" @click="cancel('submitEdit')">View Edits</button>

            <ViewEdits v-if="this.submitEdit === null" :arrayItemProp="arrayItemProp" :metaSlug="metaSlug" />
            <SubmitEdits v-if="this.submitEdit !== null" :arrayItemProp="arrayItemProp" :metaSlug="metaSlug" />
        </div>
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
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                currentUser: null,
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
            show: async function(actionType) {
                if(actionType.indexOf('submit') > -1) await this.$apollo.queries.currentUser.refetch();

                if(actionType.indexOf('submit') > -1 && !this.currentUser) {
                    this.$toasted.global.log_in();
                } else {
                    this[actionType] = true;
                }
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
            }
        }
    };
</script>