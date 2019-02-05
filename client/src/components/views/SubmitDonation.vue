<template>
    <form @submit.prevent="submitOpinionToServer()" class="normal-text">
        <h1>Submit Donation</h1>
        <label>Donation Amount (BTC)</label>
        <input type="text" v-model="donationAmount">
        <div>{{donationAmount}} BTC is about {{computedAmount}} USD</div>
        <div class="small-text">The influence of your upvotes and downvotes will change proportionally with the
            amount you've donated. Features may be implemented (or deprecated) in the future which reduce (or
            increase) the weight of your upvotes or downvotes. All donations are non-binding, no products or
            services are guaranteed in lieu of a donation, and absolutely no refunds will be performed. Please
            refer to our Privacy Policy and Terms of Service for more details.
        </div>
        <div class="block">
            I have read and agree to the <router-link to="/terms">Terms</router-link> &amp; <router-link to="/privacy">Privacy
                Policy</router-link>
            <label @click="toggleCheck()" for="agree" class="checkbox">
                <input type="checkbox" name="agree" class=".checkbox">
                <font-awesome-icon v-if="!checked" icon="square" title="Unchecked" class="checkbox__icon" />
                <font-awesome-icon v-else icon="check-square" title="Checked" class="checkbox__icon" />
            </label>
            <button type="submit">Submit Donation</button>
        </div>
    </form>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitDonation",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                cryptoValue: 0,
                donationAmount: 0,
                checked: false
            }
        },
        methods: {
            submitOpinionToServer: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (!this.checked) {
                    this.$toasted.global.accept_tos();
                } else if (this.validAmount(this.donationAmount)) {

                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitOpinion($amount: String!, $documentID: ID!, $onModel: String!, $opinion: String!){
                                submitOpinion(amount: $amount, documentID: $documentID, onModel: $onModel, opinion: $opinion)
                            }
                        `,
                        variables: {
                            amount: this.donationAmount,
                            documentID: this.arrayItemProp._id,
                            onModel: this.arrayItemProp.__typename,
                            opinion: this.opinion
                        }
                    }).then(async ({
                        data
                    }) => {
                        this.$router.push({
                            path: '/donation-status/' + data.submitOpinion
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
            },
            toggleCheck() {
                this.checked = !this.checked;
            }
        },
        computed: {
            computedAmount: function () {
                return (Number(this.donationAmount) * this.cryptoValue).toFixed(2);
            }
        },
        watch: {
            donationAmount(newValue) {
                this.validAmount(newValue);
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