<template>
    <div>
        <div class="list-vote-toolbar">
            <span class="icon" @click='submitVote(true)' title="Upvote">
                <font-awesome-icon icon="angle-up" />
            </span>
            <span class="amount-donated">
                <span v-if="calculateVotes(arrayItemProp.votes)>0">+ {{calculateVotes(arrayItemProp.votes) |
                    formatBitcoinAmount}}</span>
                <span v-else-if="calculateVotes(arrayItemProp.votes)<0">- {{calculateVotes(arrayItemProp.votes)*-1 |
                    formatBitcoinAmount}}</span>
                <span v-else-if="calculateVotes(arrayItemProp.votes)===0">{{calculateVotes(arrayItemProp.votes) |
                    formatBitcoinAmount}}</span>
            </span>
            <span class="icon" @click='submitVote(false)' title="Downvote">
                <font-awesome-icon icon="angle-down" />
            </span>
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import {
        defaultClient as apolloClient
    } from '../../apolloProvider';

    export default {
        name: "ToolbarVotes",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                argumentSpecificAmountDonated: 0,
                docIDSpecificAmountDonated: 0
            }
        },
        computed: {
            totalDonationsQuery() {
                if (this.arrayItemProp.__typename === "Rhetoric") {
                    return this.argumentSpecificAmountDonated;
                } else {
                    return this.docIDSpecificAmountDonated;
                }

            },
            slug() {
                return this.$route.params.slug;
            },
            metaSlug() {
                return this.$route.params.metaSlug;
            }
        },
        methods: {
            submitVote: async function (upVote) {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                }  else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                }  else if (!this.currentUser.accruedDonations === 0) {
                    this.$toasted.global.no_influence();
                } else {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitVote($onModel: String!, $documentID: ID!, $upVote: Boolean!) {
                                submitVote(onModel:$onModel, documentID:$documentID, upVote: $upVote) {
                                    _id
                                }
                            }
                        `,
                        variables: {
                            documentID: this.arrayItemProp._id,
                            onModel: this.arrayItemProp.__typename,
                            upVote
                        }
                    }).then(async ({
                        data
                    }) => {
                        if (this.arrayItemProp.__typename === 'Rhetoric') {
                            this.$root.$emit('votedOnTOS');
                        } else if (this.arrayItemProp.__typename !== 'Opinion') {
                            this.$root.$emit('votedOnRhetoric');
                        }
                        this.$toasted.global.vote_success();
                    }).catch(error => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            calculateVotes(voteArray) {
                var cumulativeVote = 0;
                voteArray.forEach(vote => {
                    if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
                    else cumulativeVote -= vote.createdBy.accruedDonations;
                });
                return cumulativeVote;
            },
            userVoted() {

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
                            accruedDonations
                        }
                    }
                `
            },
            cryptoValue: {
                query: gql `
                    query cryptoValue($ticker: String!){
                        cryptoValue(ticker:$ticker)
                    }
                `,
                variables: {
                    ticker: 'BTC'
                }
            }
        }
    };
</script>