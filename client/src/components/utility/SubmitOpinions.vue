<template>

    <form @submit.prevent="submitOpinionToServer()" class="normal-text">
        <div class="block">
            <label>Donation Amount (BTC)</label>
            <input type="text" v-model="donationAmount">
            <div>{{donationAmount}} BTC is about {{computedAmount}} USD</div>
            <div class="small-text">Your opinion is more (or less) likely to be seen depending on the donation's
                value. You may view the opinions on what you are commenting on to see the likelihood your
                opinion will be shown. Features may be implemented or deprecated in the future which reduce or
                increase the weight of your upvote or downvote.</div>
        </div>
        <div class="block">
            <label>Opinion</label>
            <textarea v-model="opinion" maxlength=280></textarea>
            <div class="small-text">If published, opinions will never be altered. Submitting an opinion and making a
                donation does not guarantee that your
                opinion will be approved. We reserve the right to not publish an opinion for any reason we deem
                necessary, so please remain respectful of others and intellectually honest.

                All donations are non-binding, no products or services are guaranteed in lieu of a donation, and
                absolutely no refunds will be performed, whether your opinion is published- or not. By continuing
                you are agreeing to accept the <router-link to="/terms">Terms</router-link> &amp;
                <router-link to="/privacy">Privacy Policy</router-link>.
            </div>
            <button type="submit">I Agree</button>
        </div>
    </form>

</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitOpinions",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                cryptoValue: 0,
                viewOpinions: null,
                viewEdits: null,
                donationAmount: 0,
                opinion: null,
                incoiceURL: null
            }
        },
        methods: {
            scrollToTop() {
                var element = this.$refs.success;
                var top = element.offsetTop;
                window.scrollTo(0, top);
            },
            submitOpinionToServer: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
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
                } if(value * this.cryptoValue < 1) { 
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