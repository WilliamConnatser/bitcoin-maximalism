<template>
    <div>
        <div class="toolbar--votes">
            <span @click='initialize(true)' title="Upvote">
                <font-awesome-icon icon="angle-up" />
            </span>
            <span class="amount-donated">
                <!--${{amountDonated(arrayItemProp)}}-->
            </span>
            <span @click='initialize(false)' title="Downvote">
                <font-awesome-icon icon="angle-down" />
            </span>
        </div>
        <div v-if="this.upvote !== null">
            <h2 v-if="upvote">Upvote In Progress</h2>
            <h2 v-else>Downvote In Progress</h2>
            <button @click="cancel()">Cancel Vote</button>
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ToolbarVotes",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                getCurrentUser: null,
                upvote: null
            }
        },
        methods: {
            initialize(upvote) {
                this.getCurrentUser ? this.upvote = upvote : this.$toasted.global.log_in();                
            },
            cancel() {
                this.upvote = null;
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

    .toolbar--votes {
        &>span {
            margin: 1rem;
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