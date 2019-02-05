<template>
    <div class="normal-text">
        <h1 v-if="$apollo.loading" class="loading">Loading...</h1>
        <Login v-if="!currentUser" />
        <div v-if="currentUser">
            <div class="block">
                <h1>Account Panel</h1>
                <router-link to="/submit-donation" v-if="currentUser"><button>Add Influence</button></router-link>
                <button v-if="currentUser" @click="signoutUser">Signout</button> <br />
                Current Influence: {{currentUser.accruedDonations | formatBitcoinAmount}} BTC <br />
            </div>
            {{currentUser.username}} Referral Link:<br />
            <a :href="refLink">{{refLink}}</a> <br />
            <SocialIcons :currentUser="currentUser" />

            <div v-if="currentUser.donations.length>0" class="block">
                <h2>Donations</h2>
                <ul v-for="donation in currentUser.donations" :key="donation._id" class="list">
                    <li>
                        Status: <strong>{{status(donation)}}</strong>
                        <div>{{donation.dateCreated | formatDate}}</div>
                        {{donationFor(donation.votingDonation, donation.upVote)}}
                        on <span v-html="argumentLink(donation)"></span>
                        <div v-if="!donation.active && !donation.paid">The amount of time alotted for this donation has
                            passed.</div>
                        <div v-else-if="donation.paid">
                            This donation was paid!
                        </div>
                        <div>
                            <router-link :to="statusLink(donation)">View Status</router-link>
                        </div>
                    </li>
                </ul>
            </div>

            <div v-if="currentUser.opinions.length>0" class="block">
                <h2>Opinions</h2>
                <ul v-for="opinion in currentUser.opinions" :key="opinion._id" class="list">
                    <li>
                        {{opinion._id}}
                        {{opinion.dateCreated}}
                        {{opinion.createdBy.username}}
                        {{opinion.slug}}
                        {{opinion.metaSlug}}
                        {{opinion.opinion}}
                        {{opinion.onModel}}
                        {{opinion.documentID}}
                        {{opinion.approved}}
                        {{opinion.censored}}
                        {{opinion.censoredBy}}
                        {{opinion.censoredCommentary}}
                        {{opinion.votes}}
                    </li>
                </ul>
            </div>

            <div v-if="currentUser.votes.length>0" class="block">
                <h2>Votes</h2>
                <ul v-for="vote in currentUser.votes" :key="vote._id" class="list">
                    <li>
                        {{vote.dateCreated | formatDate}}
                        <span v-if="vote.upVote">Upvote +{{vote.createdBy.accruedDonations | formatBitcoinAmount}}</span>
                        <span v-else>Downvote -{{vote.createdBy.accruedDonations | formatBitcoinAmount}}</span>
                        on {{vote.onModel}}
                        <router-link :to="argumentLink(vote)">{{argumentLink(vote)}}</router-link>
                    </li>
                </ul>
            </div>

            <div v-show="currentUser.admin">
                <h2>You so fancy! Look are you, Mr. Administrator...</h2>
            </div>
        </div>
    </div>
</template>

<script>
    import Login from '../auth/Login';
    import SocialIcons from '../utility/SocialIcons'
    import {
        defaultClient as apolloClient
    } from '../../apolloProvider';
    import gql from 'graphql-tag';

    export default {
        name: "Account",
        data() {
            return {
                currentUser: null,
                allUnapprovedOpinions: null,
                approved: null,
                approvalCommentary: []
            }
        },
        created() {
            this.$apollo.queries.currentUser.refetch();
        },
        components: {
            Login,
            SocialIcons
        },
        computed: {
            refLink() {
                return `https://www.BitcoinMaximalism.com/?ref=${this.currentUser._id}`
            }
        },
        methods: {
            statusLink(donation) {
                return `/donation-status/${donation._id}`;
            },
            argumentLink(doc) {
                return `/rhetoric/${doc.metaSlug}/${doc.slug}`;
            },
            signoutUser: () => {
                //Remove token in localStorage
                localStorage.setItem("token", "");
                //End Apollo Client Session
                apolloClient.resetStore();
            },
            status(donation) {
                if (!donation.active) return 'Inactive'
                if (!donation.paid) return 'Unpaid'
                if (donation.paid) return 'Paid'
            },
            donationFor(votingDonation, upVote) {
                if (!votingDonation) return 'Opinion';
                else if (upVote) return 'Upvote';
                else return 'Downvote';
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
                            donations {
                                _id
                                dateCreated
                                amount
                                active
                                paid
                                accruing
                                onModel
                                documentID
                            }
                            opinions {
                                _id
                                dateCreated
                                slug
                                metaSlug
                                opinion
                                onModel
                                documentID
                                approved
                                censored
                                censoredBy
                                censoredCommentary
                                votes {
                                    _id
                                    dateCreated
                                    createdBy {
                                        _id
                                        username
                                        accruedDonations
                                    }
                                }
                            }
                            votes {
                                _id
                                dateCreated
                                createdBy {
                                    _id
                                    username
                                    accruedDonations
                                }
                                slug
                                metaSlug
                                onModel
                                documentID
                                upVote
                            }
                        }
                    }
                `
            }
        }
    };
</script>