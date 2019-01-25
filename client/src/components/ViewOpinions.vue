<template>
<div>
    <ul v-if="getOpinionsModelSpecific !== null" class="opinions">
        <li v-if="getOpinionsModelSpecific.top !== null" id="top" class="opinion">
            <div>
                <strong class="opinion-label">Top: </strong>
                <strong class="opinion-username">{{getOpinionsModelSpecific.top.createdBy}}</strong>
            </div>
            <div>
                {{getOpinionsModelSpecific.top.donation.amount}} BTC
            </div>
            {{getOpinionsModelSpecific.top.opinion}}
        </li>
        <li v-if="getOpinionsModelSpecific.last !== null" id="last" class="opinion">
            <div>
                <strong class="opinion-label">Last: </strong>
                <strong class="opinion-username">{{getOpinionsModelSpecific.last.createdBy}}</strong>
            </div>
            <div>
                {{getOpinionsModelSpecific.last.donation.amount}} BTC
            </div>
            {{getOpinionsModelSpecific.last.opinion}}
        </li>
        <li v-if="getOpinionsModelSpecific.random !== null" id="random" class="opinion">
            <div>
                <strong class="opinion-label">Random: </strong>
                <strong class="opinion-username">{{getOpinionsModelSpecific.random.createdBy}}</strong>
            </div>
            <div>
                {{getOpinionsModelSpecific.random.donation.amount}} BTC
            </div>
            {{getOpinionsModelSpecific.random.opinion}}
        </li>
    </ul>
    <span class="no-opinions" v-if="getOpinionsModelSpecific === null || getOpinionsModelSpecific.top === null">No one's commented on this yet...</span>
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
                getCurrentUser: null,
                viewOpinions: null,
                viewEdits: null,
                getOpinionsModelSpecific: null
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
            },
            getOpinionsModelSpecific: {
                query: gql `query getOpinionsModelSpecific ($_id: String!, $onModel: String!) {
                    getOpinionsModelSpecific(_id: $_id, onModel: $onModel) {
                        top {
                            _id
                            createdBy
                            dateApproved
                            opinion
                            donation {
                                amount
                            }
                        }
                        last {
                            _id
                            createdBy
                            dateApproved
                            opinion
                            donation {
                                amount
                            }
                        }
                        random {
                            _id
                            createdBy
                            dateApproved
                            opinion
                            donation {
                                amount
                            }
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

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .opinions {
        list-style-type: none;

        .opinion {
            margin: 1rem;
            padding: 1rem;

            .opinion-label {
                text-transform: uppercase;
            }
        }
    }

    .no-opinions {
        margin: 2rem;
        padding: 2rem;
    }
</style>