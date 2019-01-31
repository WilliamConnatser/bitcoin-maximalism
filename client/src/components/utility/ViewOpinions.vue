<template>
<div>
    <ul v-if="topLastRandomOpinions && topLastRandomOpinions[0]" class="opinions">
        <li v-for="(opinion, index) in topLastRandomOpinions" class="opinion" :key="index">
            <div>
                <strong class="opinion-label">{{title(index)}}: </strong>
                <strong class="opinion-username">{{opinion.createdBy}}</strong>
            </div>
            <div>
                {{opinion.originalDonation.amount | formatBitcoinAmount}} BTC
            </div>
            {{opinion.opinion}}
        </li>
    </ul>
    <span class="no-opinions" v-if="!topLastRandomOpinions || !topLastRandomOpinions[0]">
        No one's commented on this yet...
    </span>
</div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ViewOpinions",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                currentUser: null,
                viewOpinions: null,
                viewEdits: null,
                topLastRandomOpinions: null
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
                this.currentUser ? this[actionType] = true : this.$toasted.global.log_in();
            },
            title(index) {
                if(index === 0) return "top";
                if(index === 1) return "last";
                if(index === 2) return "random";
            }
        },
        computed: {
            opinionArray() {
                return this.topLastRandomOpinions;
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
            topLastRandomOpinions: {
                query: gql `query topLastRandomOpinions ($_id: String!, $onModel: String!) {
                    topLastRandomOpinions(_id: $_id, onModel: $onModel) {
                        _id
                        createdBy
                        dateApproved
                        opinion
                        originalDonation {
                            amount
                        }
                    }
                }`,
                variables() {
                    return {
                        _id: this.arrayItemProp._id,
                        onModel: this.arrayItemProp.__typename
                    }
                }
            }
        }
    };
</script>