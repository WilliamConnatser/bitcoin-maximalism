<template>
    <div>
        <div class="list-vote-toolbar">
            <a href="#" class="icon fancy-link" @click='submitVote(true)' title="Upvote">
                <font-awesome-icon icon="angle-up" />
            </a>
            <span class="amount-donated">
                <span v-if="calculateVotes(arrayItemProp.votes)>0">+ {{calculateVotes(arrayItemProp.votes) |
                    formatBitcoinAmount}}</span>
                <span v-else-if="calculateVotes(arrayItemProp.votes)<0">- {{calculateVotes(arrayItemProp.votes)*-1 |
                    formatBitcoinAmount}}</span>
                <span v-else-if="calculateVotes(arrayItemProp.votes)===0">{{calculateVotes(arrayItemProp.votes)*-1 |
                    formatBitcoinAmount}}</span>
            </span>
            <a href="#" class="icon fancy-link" @click='submitVote(false)' title="Downvote">
                <font-awesome-icon icon="angle-down" />
            </a>
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ToolbarVotes",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                cryptoValue: null
            }
        },
        computed: {
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
                                submitVote(onModel:$onModel, documentID:$documentID, upVote: $upVote)
                            }
                        `,
                        variables: {
                            documentID: this.arrayItemProp._id,
                            onModel: this.arrayItemProp.__typename,
                            upVote
                        }
                    }).then(() => {
                        if (this.arrayItemProp.__typename === 'Rhetoric') {
                            this.$parent.$emit('vote-tos');
                        } else if (this.arrayItemProp.__typename === 'Opinion') {
                            this.$emit('vote-opinion');
                        } else {
                            this.$parent.$emit('vote-rhetoric');
                        }
                        this.$toasted.global.vote_success();
                    }).catch(() => {
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