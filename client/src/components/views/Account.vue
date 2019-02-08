<template>
    <div class="normal-text">
        <Login v-if="!currentUser" />
        <div v-if="currentUser">
            <div>
                <div>
                    <h1>Account Panel</h1>
                    <router-link to="/submit-donation"><button>Add Influence</button></router-link>
                    <button @click="signoutUser">Signout</button>
                </div>
                <div>
                    Influence: {{currentUser.accruedDonations | formatBitcoinAmount}}
                </div>
                Referral Link: <a :href="refLink" class="small-text">{{refLink}}</a>
                <SocialIcons :currentUser="currentUser" />
            </div>

            <h1>History</h1>
            <button @click="toggleHistoryTab('Donation')" :class="tabButtonStyle('Donation')">Donations</button>
            <button @click="toggleHistoryTab('Opinion')" :class="tabButtonStyle('Opinion')">Opinions</button>
            <button @click="toggleHistoryTab('Vote')" :class="tabButtonStyle('Vote')">Votes</button>

            <h1 v-if="$apollo.loading" class="loading">Loading...</h1>

            <div v-if="historyTab === 'Donation'" class="medium-margin">
                <h2>Donations</h2>
                <div v-if="currentUser.donations.length>0">
                    <ul v-for="donation in currentUser.donations" :key="donation._id" class="list">
                        <li>
                            <div><strong>{{donation.dateCreated | formatDate}}</strong></div>
                            <div>Donation For: {{donationFor(donation.accruing, donation.onModel)}}</div>
                            Status: <strong>{{status(donation)}}</strong>
                            <div v-if="!donation.active && !donation.paid">
                                This invoice expired without payment.
                            </div>
                            <div v-else-if="donation.paid">
                                This donation was paid!
                            </div>
                            <div>
                                <router-link :to="statusLink(donation)" class="uppercase">Info</router-link>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    You haven't made any donations yet.
                </div>
            </div>

            <div v-if="historyTab === 'Opinion'" class="medium-margin">
                <h2>Opinions</h2>
                <div v-if="currentUser.opinions.length>0">
                    <ul v-for="opinion in currentUser.opinions" :key="opinion._id" class="list">
                        <li>
                            <strong>{{opinion.dateCreated | formatDate}}</strong>
                            <div>
                                Influence:
                                <span v-if="calculateVotes(opinion.votes)>0">+ {{calculateVotes(opinion.votes) |
                                    formatBitcoinAmount}}</span>
                                <span v-else-if="calculateVotes(opinion.votes)<0">- {{calculateVotes(opinion.votes)*-1
                                    | formatBitcoinAmount}}</span>
                                <span v-else-if="calculateVotes(opinion.votes)===0">{{calculateVotes(opinion.votes) |
                                    formatBitcoinAmount}}</span>
                            </div>
                            {{opinion.opinion}}
                            <div>
                                <router-link :to="argumentLink(opinion.metaSlug, opinion.slug)">{{argumentLink(opinion.metaSlug,opinion.slug)}}</router-link>
                            </div>
                            <div v-if="opinion.censored">
                                <div v-if="!approved">
                                    Removed From Website
                                </div>
                                <div v-else>
                                    Edited By Administrators
                                </div>
                                Done By: {{opinion.censoredBy}} <br/>
                                Notes: {{opinion.censoredCommentary}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    You haven't submitted any opinions yet.
                </div>
            </div>

            <div v-if="historyTab === 'Vote'" class="medium-margin">
                <h2>Votes</h2>
                <div v-if="currentUser.votes.length>0">
                    <ul v-for="vote in currentUser.votes" :key="vote._id" class="list">
                        <li>
                            <div><strong>{{vote.dateCreated | formatDate}}</strong></div>
                            <div>
                                <span v-if="vote.upVote">Upvote +{{currentUser.accruedDonations | formatBitcoinAmount}}</span>
                                <span v-else>Downvote -{{currentUser.accruedDonations | formatBitcoinAmount}}</span>
                            </div>
                            <router-link :to="argumentLink(vote.metaSlug, vote.slug)">{{argumentLink(vote.metaSlug, vote.slug)}}</router-link>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    You haven't submitted any votes yet.
                </div>
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
                approvalCommentary: [],
                historyTab: 'Donation'
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
            argumentLink(metaSlug, slug) {
                if (slug !== null) {
                    return `/rhetoric/${metaSlug}/${slug}`;
                } else {
                    return `/rhetoric/${metaSlug}`;
                }
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
            donationFor(accruing, onModel) {
                if (accruing) return 'Influence';
                else if (onModel === 'Certificate') return 'Certificate';
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
            toggleHistoryTab(tabName) {
                this.historyTab = tabName;
            },
            tabButtonStyle(tabName) {
                if (tabName === this.historyTab) return "small-button selected-button";
                else return "small-button";
            },
            calculateVotes(voteArray) {
                var cumulativeVote = 0;
                voteArray.forEach(vote => {
                    if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
                    else cumulativeVote -= vote.createdBy.accruedDonations;
                });
                return cumulativeVote;
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