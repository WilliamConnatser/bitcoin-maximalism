<template>
    <form @submit.prevent="submitDonation()" class="container apollo-response">
        <h1 class="heading">submit donation</h1>

        <div class="medium-margin">
            <label>Username</label>
            <select v-if="currentUser && allUsernames" v-model="userID">
                <option v-for="user in allUsernames" :key="user._id" :value="user._id"
                    :selected="sameUser(user.username)">
                    {{user.username}}
                </option>
            </select>
            <p class="extra-small-text">
                In most circumstances users will probably want to make sure their username is selected above, but
                you may also make a donation on the behalf of another user if you would like to. Instead of the
                donation
                boosting your own influence, the donation would boost their influence.
            </p>
        </div>
        <div class="medium-margin">
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
        </div>
        <div v-if="currentUser && currentUser.admin" class="medium-margin">
            <strong>
                All Administrator-created donations will be automatically marked as paid. Donations created by the
                administrator are for documenting when The Site makes a donation to an open source project. Which
                project is The Site donating to??
            </strong>
            <label>Choose Project</label>
            <select v-if="allProjects" v-model="projectID">
                <option v-for="project in allProjects" :key="project._id" :value="project._id"
                    :selected="project._id === projectID">
                    {{project.metaSlug}} - {{project.title}}
                </option>
            </select>
        </div>
        <div class="medium-margin">
            I have read and agree to the <router-link to="/terms" class="small-uppercase-link">Terms</router-link> &amp;
            <router-link to="/privacy" class="small-uppercase-link">Privacy Policy</router-link>
            <label @click="toggleCheck()" for="agree" class="checkbox">
                <input type="checkbox" name="agree" class="checkbox">
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
        data() {
            return {
                currentUser: null,
                allUsernames: null,
                allProjects: null,
                projectID: null,
                userID: null,
                cryptoValue: 0,
                donationAmount: 0,
                checked: false,
                confirmedDifferentUser: false
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
                } else if (!this.currentUser.admin && !this.validUser(this.userID)) {
                    this.$toasted.show('An invalid user was submitted', {
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
                } else if (!this.currentUser.admin && this.currentUser._id !== this.userID && !this
                    .confirmedDifferentUser) {
                    this.$toasted.show(
                        'You are making a donation on behalf of a different user. Are you sure you want to do this?', {
                            duration: null,
                            position: 'bottom-center',
                            fullWidth: true,
                            fitToScreen: true,
                            singleton: true,
                            action: [{
                                text: 'Cancel',
                                onClick: (e, toastObject) => {
                                    toastObject.goAway(0);
                                }
                            }, {
                                text: 'Continue',
                                onClick: (e, toastObject) => {
                                    this.confirmedDifferentUser = true;
                                    this.submitDonation();
                                    toastObject.goAway(0);
                                }
                            }]
                        });
                } else if (this.currentUser.admin && !this.projectID) {
                    this.$toasted.show(
                        'You must pick a project to donate to', {
                            duration: null,
                            position: 'bottom-center',
                            fullWidth: true,
                            fitToScreen: true,
                            singleton: true,
                            action: [{
                                text: 'Cancel',
                                onClick: (e, toastObject) => {
                                    toastObject.goAway(0);
                                }
                            }]
                        });
                } else if (this.validAmount(this.donationAmount)) {

                    let variables;
                    if (!this.currentUser.admin) {
                        variables = {
                            amount: this.donationAmount,
                            userID: this.userID
                        }
                    } else {
                        variables = {
                            amount: this.donationAmount,
                            userID: this.currentUser._id,
                            onModel: 'Poject',
                            documentID: this.projectID
                        }
                    }

                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitDonation($amount: String!, $userID: ID!, $onModel: String, $documentID: ID){
                                submitDonation(amount: $amount, userID: $userID, onModel: $onModel, documentID: $documentID)
                            }
                        `,
                        variables
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
            validUser(userID) {
                if (!this.allUsernames.find(user => user._id === userID)) {
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
                            admin
                            emailVerified
                        }
                    }
                `,
                result({
                    data
                }) {
                    this.userID = data.currentUser._id;
                }

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
            },
            allProjects: {
                query: gql `
                    query allProjects {
                        allProjects {
                            _id
                            metaSlug
                            title
                        }
                    }
                `,
                skip() {
                    if (this.currentUser && this.currentUser.admin) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    };
</script>