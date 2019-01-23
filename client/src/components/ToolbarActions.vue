<template>
    <div>
        <div class="toolbar--actions">
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
    import ViewOpinions from './ViewOpinions';
    import ViewEdits from './ViewEdits';
    import SubmitOpinions from './SubmitOpinions';
    import SubmitEdits from './SubmitEdits';

    export default {
        name: "ToolbarActions",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                getCurrentUser: null,
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
            show(actionType) {
                this[actionType] = true;
            },
            initialize(actionType) {
                this.getCurrentUser ? this[actionType] = true : this.$toasted.global.log_in();
            }
        },
        components: {
            ViewOpinions,
            ViewEdits,
            SubmitOpinions,
            SubmitEdits
        },
        apollo: {
            getCurrentUser: {
                query: gql `
                    query getCurrentUser {
                        getCurrentUser {
                            _id
                            username
                            email
                            emailValidated
                            active
                            admin
                            allegiance
                            maximalist
                        }
                    }
                `
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .toolbar--actions {
        &>* {
            font-size: 2.5rem;
            font-weight: 400;
            margin: 1rem 2rem;
        }
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 35%;
        height: 5rem;
        padding: .5rem;
        margin: 0rem .5rem;
        border: 0.1rem solid $color-white;
    }
</style>