<template>
    <div>
        <div class="list-vote-toolbar">
            <a :class="voteIconClass(true)" @click='submitVote(true)' title="Upvote">
                <font-awesome-icon icon="angle-up" class="vote-icon" />
            </a>
            <span class="amount-donated">
                <span v-if="calculateVotes>0">+ {{calculateVotes | formatBitcoinAmount}}</span>
                <span v-else-if="calculateVotes<0">- {{calculateVotes*-1 | formatBitcoinAmount}}</span>
                <span v-else-if="calculateVotes===0">{{calculateVotes*-1 | formatBitcoinAmount}}</span>
            </span>
            <a :class="voteIconClass(false)" @click='submitVote(false)' title="Downvote">
                <font-awesome-icon icon="angle-down" class="vote-icon" />
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
            },
            calculateVotes() {
                let cumulativeVote = 0;
                this.arrayItemProp.votes.forEach(vote => {
                    if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
                    else cumulativeVote -= vote.createdBy.accruedDonations;
                });
                return cumulativeVote;
            }
        },
        methods: {
            submitVote: async function (upVote) {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (!this.currentUser.accruedDonations === 0) {
                    this.$toasted.show(
                        'You don\'t have any influence. Add influence in your Account Panel by making a donation', {
                            duration: 5000,
                            position: 'bottom-center',
                            fullWidth: true,
                            fitToScreen: true,
                            singleton: true,
                            action: [{
                                text: 'Account Panel',
                                push: '/account'
                            }, {
                                text: 'Close',
                                onClick: (e, toastObject) => {
                                    toastObject.goAway(0);
                                }
                            }]
                        });
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

                        if (this.$route.fullPath.indexOf('leaderboards') > -1) {
                            if (this.arrayItemProp.__typename === 'Rhetoric') {
                                this.$parent.$emit('arguments-changed');
                            } else if (this.arrayItemProp.__typename === 'Opinion') {
                                this.$parent.$emit('opinions-changed');
                            } else if (this.arrayItemProp.__typename === 'Resource') {
                                this.$parent.$emit('resources-changed');
                            } else if (this.arrayItemProp.__typename === 'BulletPoint') {
                                this.$parent.$emit('bulletpoints-changed');
                            } else if (this.arrayItemProp.__typename === 'Project') {
                                this.$parent.$emit('projects-changed');
                            }
                        } else {
                            if (this.arrayItemProp.__typename === 'Rhetoric') {
                                this.$parent.$emit('update-tos-query');
                            } else if (this.arrayItemProp.__typename === 'Opinion') {
                                this.$emit('update-view-opinion-query');
                            } else if (this.arrayItemProp.__typename === 'BulletPoint' ||
                                this.arrayItemProp.__typename === 'Resource')  {
                                this.$parent.$emit('update-arguments-query');
                            } else if (this.arrayItemProp.__typename === 'Project') {
                                this.$parent.$emit('update-projects-query');
                            }

                        }

                        this.$toasted.show('Vote submitted successfully', {
                            duration: 5000,
                            position: 'bottom-center',
                            fullWidth: true,
                            fitToScreen: true,
                            singleton: true,
                            action: [{
                                text: 'Close',
                                onClick: (e, toastObject) => {
                                    toastObject.goAway(0);
                                }
                            }]
                        });
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            voteIconClass(upVote) {
                if (this.currentUser) {

                    let match = this.arrayItemProp.votes.find(vote => {
                        return (vote.createdBy._id === this.currentUser._id && vote.upVote === upVote)
                    });

                    if (match) {
                        return "icon already-voted cursor-pointer";
                    } else {
                        return "icon unstyled-link cursor-pointer";
                    }

                } else {
                    return "icon unstyled-link cursor-pointer";
                }
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