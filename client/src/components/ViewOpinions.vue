<template>
<div>
    <ul v-if="getOpinionsModelSpecific && getOpinionsModelSpecific[0]" class="opinions">
        <li v-for="(opinion, index) in getOpinionsModelSpecific" class="opinion" :key="index">
            <div>
                <strong class="opinion-label">{{title(index)}}: </strong>
                <strong class="opinion-username">{{opinion.createdBy}}</strong>
            </div>
            <div>
                {{toFixed(opinion.originalDonation.amount)}} BTC
            </div>
            {{opinion.opinion}}
        </li>
    </ul>
    <span class="no-opinions" v-if="!getOpinionsModelSpecific || !getOpinionsModelSpecific[0]">
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
            },
            toFixed(number) {
                return number.toFixed(8);
            },
            title(index) {
                if(index === 0) return "top";
                if(index === 1) return "last";
                if(index === 2) return "random";
            }
        },
        computed: {
            opinionArray() {
                return this.getOpinionsModelSpecific;
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

    .opinions {
        margin: 5rem;
    }
</style>