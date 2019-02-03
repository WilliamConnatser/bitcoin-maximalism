<template>
    <div class="normal-text">
        <h1 v-if="$apollo.loading">Loading...</h1>
        <Login v-if="!currentUser" />
        <div v-if="currentUser">
            <h1>Account Panel</h1>
            Current Influence: {{currentUser.accruedDonations | formatBitcoinAmount}} <br />
            <button id="signOut" v-if="currentUser" @click="signoutUser">Signout</button>

            <div v-if="currentUser.certificates.length>0" class="block">
                <h2>Certificates</h2>
                <ul v-for="certificate in currentUser.certificates" :key="certificate._id" class="list">
                    <li>
                        {{_id}}
                        {{dateCreated}}
                        {{createdBy.username}}
                        {{active}}
                        {{activeUntil}}
                        {{name}}
                        {{protagonistic}}
                        {{donationID}}
                    </li>
                </ul>
            </div>

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
                        {{_id}}
                        {{dateCreated}}
                        {{createdBy.username}}
                        {{slug}}
                        {{metaSlug}}
                        {{opinion}}
                        {{onModel}}
                        {{documentID}}
                        {{approved}}
                        {{censored}}
                        {{censoredBy}}
                        {{censoredCommentary}}
                        {{votes}}
                    </li>
                </ul>
            </div>

            <div v-if="currentUser.votes.length>0" class="block">
                <h2>Votes</h2>
                <ul v-for="vote in currentUser.votes" :key="vote._id" class="list">
                    <li>
                        {{_id}}
                        {{dateCreated}}
                        {{createdBy._id}}
                        {{createdBy.username}}
                        {{createdBy.accruedDonations}}
                        {{slug}}
                        {{metaSlug}}
                        {{onModel}}
                        {{documentID}}
                        {{upVote}}
                    </li>
                </ul>
            </div>

            <div v-show="currentUser.admin">
                <h2>You so fancy! Look are you, Mr. Administrator...</h2>
                <ul v-for="unapprovedOpinion in allUnapprovedOpinions" :key="unapprovedOpinion._id" class="basic-list">
                    <li>
                        {{unapprovedOpinion}}
                        <textarea v-model="approvalCommentary[unapprovedOpinion._id]"></textarea>
                        <button @click="approveOpinion(unapprovedOpinion, true)">Approve</button>
                        <button @click="approveOpinion(unapprovedOpinion, false)">Deny</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import Login from '../auth/Login';
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
            Login
        },
        methods: {
            statusLink(donation) {
                return '/donation-status/' + donation._id;
            },
            argumentLink(donation) {
                var metaSlug = "";
                donation.pro ? metaSlug = 'protagonistic' : metaSlug = 'antagonistic';

                return '<a href="/rhetoric/' + metaSlug + '/' + donation.slug + '">' + metaSlug + '/' + donation.slug +
                    '</a>';
            },
            signoutUser: () => {
                //Remove token in localStorage
                localStorage.setItem("token", "");
                //End Apollo Client Session
                apolloClient.resetStore();
            },
            approveOpinion: async function (unapprovedOpinion, approved) {
                await this.$apollo.queries.currentUser.refetch();

                if (this.currentUser.admin) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                        mutation ($_id: ID!, $approved: Boolean!, $approvalCommentary: String!) {
                            approveOpinion(_id: $_id, approved:$approved, approvalCommentary: $approvalCommentary)
                        }
                    `,
                        variables: {
                            _id: unapprovedOpinion._id,
                            approved,
                            approvalCommentary: this.approvalCommentary[unapprovedOpinion._id]
                        }
                    }).then(() => {
                        //Refresh the currentUser query
                        this.$apollo.queries.allUnapprovedOpinions.refetch();
                    }).catch(error => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
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
                            certificates {
                                _id
                                dateCreated
                                createdBy {
                                    username
                                }
                                active
                                activeUntil
                                name
                                protagonistic
                                donationID {
                                    _id
                                    amount
                                    paid
                                }
                            }
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
                                createdBy {
                                    username
                                }
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
            },
            allUnapprovedOpinions: {
                query: gql `
                    query {
                        allUnapprovedOpinions {
                            _id
                            dateCreated
                            createdBy {
                                username
                            }
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
                    }
                `,
                skip: async function () {
                    if (this.currentUser == null || !this.currentUser.admin) return true;
                }
            },
            allUnapprovedEdits: {
                query: gql `query {
                    allUnapprovedEdits {
                        _id
                        dateCreated
                        createdBy
                        slug
                        macroSlug
                        oldDocumentID
                        newDocumentID
                        approved
                        onModel
                        approvedBy
                        approvalCommentary
                    }
                }`,
                skip: async function () {
                    if (this.currentUser === null || !this.currentUser.admin) return true;
                }
            }
        }
    };
</script>