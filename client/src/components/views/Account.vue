<template>
    <div class="section">
        <Login v-if="!currentUser" />
        <div v-if="currentUser">
            <h1>Account Panel</h1>
            <button id="signOut" v-if="currentUser" @click="signoutUser">Signout</button>
            <ul v-for="donation in userSpecificActivity" :key="donation._id" class="basic-list">
                <li>
                    Status: <strong>{{status(donation)}}</strong>
                    <div>{{donation.dateCreated | formatDate}}</div>
                    {{donationFor(donation.votingDonation, donation.upVote)}}
                    on <span v-html="argumentLink(donation)"></span>
                    <div v-if="!donation.active && !donation.paid">The amount of time alotted for this donation has
                        passed. Please re-submit your submission.</div>
                    <div v-else-if="donation.paid">
                        This donation was paid!
                    </div>
                    <div>
                        <router-link :to="statusLink(donation)">View Status</router-link>
                    </div>
                </li>
            </ul>
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
                approvalCommentary: [],
                userSpecificActivity: []
            }
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
            signoutUser: async () => {
                //Remove token in localStorage
                localStorage.setItem("token", "");
                //End Apollo Client Session
                await apolloClient.resetStore();
            },
            getStyle(allegiance) {
                if (this.currentUser.maximalist && allegiance === 'Maximalist') {
                    return 'background-color: #41b883';
                } else if (!this.currentUser.maximalist && allegiance === 'Multicoinist') {
                    return 'background-color: #41b883';
                }
            }
            /*,
                        setAllegiance(allegiance) {
                            //GraphQL Mutation
                            this.$apollo.mutate({
                                mutation: gql `
                                    mutation($allegiance: String!) {
                                        setUserAllegiance(allegiance: $allegiance){
                                            token
                                        }
                                    }
                                `,
                                variables: {
                                    allegiance
                                }
                            }).then(async ({data}) => {
                                //Insert token into Local Storage
                                await localStorage.setItem("token", data.setUserAllegiance.token);
                                //Refresh the currentUser query
                                this.$apollo.queries.currentUser.refetch();
                            }).catch(error => {
                                // Error :\
                                console.error(error);
                            });
                        }*/
            ,
            approveOpinion(unapprovedOpinion, approved) {
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
                    // Error :\
                    console.error(error);
                });
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
            currentUser: gql `
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
            `,
            allUnapprovedOpinions: {
                query: gql `
                    query {
                        allUnapprovedOpinions {
                            _id
                            dateCreated
                            createdBy
                            slug
                            pro
                            opinion
                            approved
                            onModel
                            documentID
                            approvedBy
                            approvalCommentary
                        }
                    }
                `,
                skip() {
                    if (!this.currentUser || this.currentUser.admin === false) return true;
                    if (this.$router.currentRoute.fullPath === '/account') return false;
                }
            },
            allUnapprovedEdits: {
                query: gql `query {
                    allUnapprovedEdits {
                        _id
                        dateCreated
                        createdBy
                        slug
                        pro
                        oldDocumentID
                        newDocumentID
                        approved
                        onModel
                        approvedBy
                        approvalCommentary
                    }
                }`,
                skip() {
                    if (!this.currentUser || this.currentUser.admin === false) return true;
                    if (this.$router.currentRoute.fullPath === '/account') return false;
                }
            },
            userSpecificActivity: {
                query: gql `query userSpecificActivity {
                        userSpecificActivity {
                            _id
                            dateCreated
                            createdBy
                            slug
                            pro
                            amount
                            documentID
                            onModel
                            active
                            paid
                            invoiceID
                            invoiceURL
                            votingDonation
                            upVote
                        }
                    }`,
                skip() {
                    if (!this.currentUser) return true
                    if (this.$router.currentRoute.fullPath === '/account') return false;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../sass/variables.scss";
</style>