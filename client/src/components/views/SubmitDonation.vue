<template>
    <form @submit.prevent="submitDonation()" class="container">
        <h1 class="heading">submit donation</h1>

        <div class="medium-margin">
            <label>Username</label>
            <select v-if="currentUser && allUsernames" name="user" id="user">
                <option v-for="user in allUsernames" :key="user._id" :value="user._id" :selected="sameUser(user.username)">
                    {{user.username}}
                </option>
            </select>
            <p class="extra-small-text">
                In most circumstances users will probably want to make sure their username is selected above, but
                you may also make a donation on the behalf of another user if you would like to. Instead of the donation
                boosting your own influence, the donation would boost their influence.
            </p>
        </div>

        <label>Donation Amount (BTC)</label>
        <input type="text" v-model="donationAmount">
        <div>{{donationAmount}} BTC is about {{computedAmount}} USD</div>
        <p class="extra-small-text">
            The influence of your upvotes and downvotes will change proportionally with the
            amount you've donated. Features may be implemented (or deprecated) in the future which reduce (or
            increase) the weight of your upvotes or downvotes. All donations are non-binding, no products or
            services are guaranteed in lieu of a donation, and absolutely no refunds will be performed. Please
            refer to our Privacy Policy and Terms of Service for more details.
        </p>
        <div class="medium-margin">
            I have read and agree to the <router-link to="/terms">Terms</router-link> &amp;
            <router-link to="/privacy">Privacy Policy</router-link>
            <label @click="toggleCheck()" for="agree" class="checkbox">
                <input type="checkbox" name="agree" class=".checkbox">
                <font-awesome-icon v-if="!checked" icon="square" title="Unchecked" class="checkbox__icon" />
                <font-awesome-icon v-else icon="check-square" title="Checked" class="checkbox__icon" />
            </label>
        </div>
        <div class="medium-margin">
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
                allUsernames: null,
                cryptoValue: 0,
                donationAmount: 0,
                checked: false
            }
        },
        methods: {
            submitDonation: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (!this.checked) {
                    this.$toasted.show('You must accept the Terms of Service and Privacy Policy.', {
                        duration: null,
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
                } else if (this.validAmount(this.donationAmount)) {

                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitDonation($amount: String!){
                                submitDonation(amount: $amount)
                            }
                        `,
                        variables: {
                            amount: this.donationAmount
                        }
                    }).then(async ({
                        data
                    }) => {
                        this.$router.push({
                            path: '/donation-status/' + data.submitDonation
                        });
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validAmount(value) {
                if (isNaN(Number(value))) {
                    this.donationAmount = this.donationAmount.replace(/\D/g, '');
                    this.$toasted.show('Donations may only contain numbers', {
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
                    return false;
                } else if (value < 0) {
                    this.donationAmount *= -1;
                    this.$toasted.show('Donations amounts may only be positive', {
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
                    return false;
                } else if (Number(value) === 0) {
                    this.$toasted.show('Donations must be a non-zero number', {
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
                    return false;
                }
                if (value * this.cryptoValue < 1) {
                    this.$toasted.show('Donations must be more than $1', {
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
                    return false;
                } else if (value.indexOf('.') < 0) {
                    //If no decimals, then no need to check for max decimals
                    return true;
                } else if (value.toString().split(".")[1].length > 8) {
                    this.donationAmount = Number(this.donationAmount).toFixed(8);
                    this.$toasted.show('Donations may only contain a maximum of 8 decimal places', {
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
                    return false;
                } else {
                    return true;
                }
            },
            toggleCheck() {
                this.checked = !this.checked;
            },
            sameUser(username) {
                if (username === this.currentUser.username) return true;
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
                            emailVerified
                        }
                    }
                `
            },
            allUsernames: {
                query: gql `
                    query {
                        allUsernames {
                            _id
                            username
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