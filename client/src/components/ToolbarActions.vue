<template>
    <div>
        <div class="toolbar--actions">
            <font-awesome-icon @click="initialize('comment')" icon="comment-dollar" title="Comment" />
            <font-awesome-icon @click="initialize('edit')" icon="pen-square" title="Submit Edit" />
            <font-awesome-icon @click="initialize('remove')" icon="minus-square" title="Remove Argument" />
        </div>

        <div v-if="this.comment !== null">
            <h2>Comment In Progress</h2>
            <button @click="cancel('comment')">Cancel Comment</button>
        </div>

        <div v-if="this.edit !== null">
            <h2>Edit In Progress</h2>
            <button @click="cancel('edit')">Cancel Edit</button>
        </div>

        <div v-if="this.remove !== null">
            <h2>Removal In Progress</h2>
            <button @click="cancel('remove')">Cancel Removal</button>
        </div>


    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ToolbarActions",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                getCurrentUser: null,
                comment: null,
                edit: null,
                remove: null
            }
        },
        methods: {
            cancel(actionType) {
                this[actionType] = null;
            },
            initialize(actionType) {
                this.getCurrentUser ? this[actionType] = true : this.$toasted.global.log_in();
            }
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
            font-size: 3rem;
            font-weight: 600;
            margin: 1rem 2rem;
        }
    }

    input {
        display: inline-block;
        width: 75vw;
        height: 4rem;
        font-size: 1.5rem;
        border: 0.1rem solid $color-white;
    }

    label {
        text-align: center;
        color: $color-white;
        display: inline-block;
        width: 80vw;
        font-size: 1.9rem;
        font-weight: 200;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 40vw;
        height: 4rem;
        padding: .5rem;
        margin-bottom: 4rem;
        border: 0.1rem solid $color-white;
    }

    .block {
        margin: 3rem;
    }
</style>