<template>
    <div>
        <div class="toolbar--votes">
            <span class="icon" @click='initialize(true)' title="Upvote">
                <font-awesome-icon icon="angle-up" />
            </span>
            <span class="amount-donated">
                <span v-if="arrayItemProp.accruedVotes>0">+ {{arrayItemProp.accruedVotes | formatBitcoinAmount}}</span>
                <span v-if="arrayItemProp.accruedVotes<0">- {{arrayItemProp.accruedVotes*-1 | formatBitcoinAmount}}</span>
                <span v-if="arrayItemProp.accruedVotes===0">{{arrayItemProp.accruedVotes*-1 | formatBitcoinAmount}}</span>
            </span>
            <span class="icon" @click='initialize(false)' title="Downvote">
                <font-awesome-icon icon="angle-down" />
            </span>
        </div>
        <div v-if="this.upvote !== null" class="normal-text">
            <h2 v-if="upvote">Submit an Upvote</h2>
            <h2 v-else>Submit a Downvote</h2>
            <button @click="cancel()">
                Hide
                <span v-if="upvote">Upvote</span>
                <span v-else>Downvote</span>
            </button>

            <form @submit.prevent="submitVote(upvote)">
                <div class="block">
                    <label>Donation Amount (BTC)</label>
                    <input id="donation-amount" type="text" v-model="donationAmount">
                    <div>{{donationAmount}} BTC is about {{computedAmount}} USD</div>
                    <div class="small-text">Your <span v-if="upvote">upvote</span><span v-else>downvote</span>
                        will be weighted by an amount proportional to
                        your donation, which is then compared to the amount of all other upvote and downvote
                        donations for this specific {{arrayItemProp.__typename}}.
                        Features may be implemented or deprecated in the future which reduce
                        (or increase) the weight of your upvotes or downvotes. All donations are non-binding. No
                        products or services are guaranteed in lieu of a
                        donation, and no refunds will be performed whether your upvote or downvote is tallied or
                        not. By
                        continuing you are agreeing to accept the <router-link to="/terms">Terms</router-link>
                        &amp;
                        <router-link to="/privacy">Privacy Policy</router-link>.
                    </div>
                </div>
                <div class="block">
                    <button type="submit">I Agree</button>
                </div>
            </form>
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
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                currentUser: null,
                upvote: null,
                argumentSpecificAmountDonated: 0,
                docIDSpecificAmountDonated: 0,
                slug: "",
                donationAmount: 0,
                deActivate: true,
            }
        },
        computed: {
            pro() {
                if (this.$route.params.metaSlug == "protagonistic") {
                    return true;
                } else {
                    return false;
                }
            },
            totalDonationsQuery() {
                if (this.arrayItemProp.__typename === "Rhetoric") {
                    return this.argumentSpecificAmountDonated;
                } else {
                    return this.docIDSpecificAmountDonated;
                }

            },
            computedAmount: function () {
                return (this.donationAmount * this.cryptoValue).toFixed(2);
            }
        },
        methods: {
            initialize: async function (upvote) {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else {
                    this.upvote = upvote;
                }
            },
            cancel() {
                this.upvote = null;
            },
            scrollToTop() {
                var element = this.$refs.success;
                var top = element.offsetTop;
                window.scrollTo(0, top);
            },
            submitVote: async function (upVote) {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (this.validAmount(this.donationAmount)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitVote($onModel: String!, $documentID: ID!, $amount: String!, $upVote: Boolean!) {
                                submitVote(onModel:$onModel, documentID:$documentID, amount:$amount, upVote: $upVote)
                            }
                        `,
                        variables: {
                            amount: this.donationAmount,
                            documentID: this.arrayItemProp._id,
                            onModel: this.arrayItemProp.__typename,
                            upVote
                        }
                    }).then(async ({
                        data
                    }) => {
                        this.$router.push({
                            path: '/donation-status/' + data.submitVote
                        });
                    }).catch(error => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validAmount(value) {
                if (isNaN(Number(value))) {
                    this.donationAmount = this.donationAmount.replace(/\D/g, '');
                    this.$toasted.global.invalid_donation_numbers_only();
                    return false;
                } else if (value < 0) {
                    this.donationAmount *= -1;
                    this.$toasted.global.invalid_donation_negative();
                    return false;
                } else if (Number(value) === 0) {
                    this.$toasted.global.invalid_donation_nonzero();
                    return false;
                }
                if (value * this.cryptoValue < 1) {
                    this.$toasted.global.invalid_donation_minimum();
                    return false;
                } else if (value.indexOf('.') < 0) {
                    //If no decimals, then no need to check for max decimals
                    return true;
                } else if (value.toString().split(".")[1].length > 8) {
                    this.donationAmount = Number(this.donationAmount).toFixed(8);
                    this.$toasted.global.invalid_donation_decimal();
                    return false;
                } else {
                    return true;
                }
            }
        },
        watch: {
            donationAmount(newValue) {
                this.validAmount(newValue)
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