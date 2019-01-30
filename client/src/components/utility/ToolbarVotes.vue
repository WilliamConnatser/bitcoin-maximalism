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
        <div v-if="this.upvote !== null">
            <h2 v-if="upvote">Submit an Upvote</h2>
            <h2 v-else>Submit a Downvote</h2>
            <button @click="cancel()">
                Hide
                <span v-if="upvote">Upvote</span>
                <span v-else>Downvote</span>
            </button>

            <div ref="success">
                <form v-if="!submitted" @submit.prevent="submitVote(upvote)">
                    <div class="block">
                        <label>Donation Amount (BTC)</label>
                        <input id="donation-amount" type="text" v-model="donationAmount">
                        <div>{{donationAmount}} BTC is about {{computedAmount}} USD</div>
                        <div class="description">Your <span v-if="upvote">upvote</span><span v-else>downvote</span>
                            will be weighted by an amount proportional to
                            your donation, which is then compared to the amount of all other upvote and downvote
                            donations for this specific {{arrayItemProp.__typename}}.
                            Features may be implemented or deprecated in the future which reduce
                            (or increase) the weight of your upvotes or downvotes.</div>
                    </div>
                    <div class="block">
                        <div class="description">
                            All donations are non-binding. No products or services are guaranteed in lieu of a
                            donation, and no refunds will be performed whether your upvote or downvote is tallied or
                            not. By
                            continuing you are agreeing to accept the <router-link to="/terms">Terms</router-link>
                            &amp;
                            <router-link to="/privacy">Privacy Policy</router-link>.
                        </div>
                    </div>
                    <button type="submit">I Agree</button>
                </form>
                <div id="success" v-else>
                    <h2>Success!</h2>
                    
                    <iframe :src="invoiceURL" scrolling="no">{{invoiceURL}}</iframe>

                    If the donation is completed successfully, then your upvote or downvote should be attributed
                    shortly.
                    You may track the history of your upvotes and downvotes in the user <router-link to="/account">Account
                        Panel</router-link>.
                </div>
            </div>
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
                submitted: null,
                donationAmount: "",
                deActivate: true,
                invoiceURL: ""
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
            computedAmount: function() {
                return (this.donationAmount * this.cryptoValue).toFixed(2);
            }        
        },
        methods: {
            initialize(upvote) {
                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                    //Remove token in localStorage
                    localStorage.setItem("token", "");
                    //End Apollo Client Session
                    apolloClient.resetStore();
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
            submitVote(upVote) {
                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                    //Remove token in localStorage
                    localStorage.setItem("token", "");
                    //End Apollo Client Session
                    apolloClient.resetStore();
                } else {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitVote($onModel: String!, $documentID: ID!, $amount: Float!, $upVote: Boolean!) {
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
                        this.setInvoiceURL(data.submitVote)
                        this.submitted = true;
                    }).catch(error => {
                        // Error :\
                        // Error handled in main.js
                    });
                }
            },
            setInvoiceURL(url) {
                this.invoiceURL = url;
            },
            validAmount(value) {
                if(value < 0) {
                    this.donationAmount *= -1;
                    this.$toasted.global.invalid_donation_negative();
                    return false;
                }
                if(Math.floor(value) === value) return true;
                if(value.indexOf('.') < 0) return true;
                if(value.toString().split(".")[1].length > 8) {
                    this.$toasted.global.invalid_donation_decimal();
                    this.donationAmount = Number(this.donationAmount).toFixed(8);
                    return false;
                } else {
                    return true;
                }
            }
        },
        watch: {
            submitted(newValue) {
                if (newValue) this.scrollToTop();
            },
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

<style lang="scss" scoped>
    @import "../../sass/variables.scss";

    .toolbar--votes {
        .icon {
            font-size: 3rem;
            font-weight: 600;
            margin: 1rem 2rem;
        }

        .amount-donated {
            font-size: 2rem;
        }
    }

    .block {
        margin: 3rem;
    }

    input {
        text-align: center;
        display: inline-block;
        max-width: 65rem;
        width: 90%;
        height: 4rem;
        border: 0.1rem solid $color-white;
        color: $color-white;
        background-color: $color-green;
    }

    #donation-amount {
        font-size: 2rem;
        max-width: 20rem;
    }

    textarea {
        text-align: center;
        display: inline-block;

        width: 100%;
        height: 30rem;
        font-size: 2rem;
        border: 0.1rem solid $color-white;
        color: $color-white;
        background-color: $color-green;
    }

    label {
        color: $color-white;
        display: inline-block;
        width: 100%;
        font-size: 1.9rem;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 35%;
        height: 5rem;
        padding: .5rem;
        margin: .5rem;
        border: 0.1rem solid $color-white;
    }

    .description {
        font-size: 1.5rem;
    }
    
    iframe {
        overflow: scroll;
        width: 90vw;
        height: 71rem;
    }
</style>