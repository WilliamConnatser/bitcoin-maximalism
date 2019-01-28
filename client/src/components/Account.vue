<template>
    <div class="section">
        <Login v-if="!currentUser" />
        <div v-if="currentUser">
            <h1>Account Panel</h1>
            <button id="signOut" v-if="currentUser" @click="signoutUser">Signout</button>
            <!--
            <div class="allegiance">
                <p v-if="!currentUser.allegiance">
                    You have not yet sworn allegiance to either faction. Your ancestors would be ashamed...
                </p>
                <p v-else>
                    You have identified as a {{getAllegiance}}!
                </p>
                <div>
                    All of your donations will go towards your sworn allegiance's
                    <router-link to="/activity">score</router-link>.
                </div>
                <button class="allegiance-button" @click="setAllegiance('Maximalist')" :style="getStyle('Maximalist')">
                    I identify as a Bitcoin Maximalist
                </button>
                <button class="allegiance-button" @click="setAllegiance('Multicoinist')" :style="getStyle('Multicoinist')">
                    I identify as a Multicoinist
                </button>
            </div>
            -->
            <ul>
                <li v-for="donation in userSpecificActivity" :key="donation._id">
                    <div>{{donation.dateCreated | formatDate}}</div>
                    <div>Donation Status: {{status(donation)}} | Amount: {{donation.amount | bitcoinAmount}}</div>
                    <span v-if="donation.votingDonation">
                        <span v-if="donation.upVote">Upvote</span>
                        <span v-else>Downvote</span>
                    </span>
                    <span v-else>Opinion</span>
                    on {{donation.onModel}}
                    (<span v-if="donation.pro">Protagonistic/{{donation.slug | stringifySlug}}</span>
                    <span v-else>Antagonistic/{{donation.slug | stringifySlug}}</span>)
                    <div v-if="donation.active && !donation.paid"><a :href="donation.invoiceURL">Pay Here!</a></div>
                    <div v-else-if="!donation.active && !donation.paid">The amount of time alotted for this donation
                        has passed. Please re-submit your submission.</div>
                    <div v-if="!donation.votingDonation">
                
                    </div>
                </li>
            </ul>
            <div v-show="currentUser.admin">
                <h2>You so fancy! Look are you, Mr. Administrator...</h2>
                <ul>
                    <li v-for="unapprovedOpinion in allUnapprovedOpinions" :key="unapprovedOpinion._id">
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
    import Login from './auth/Login';
    import {
        defaultClient as apolloClient
    } from '../main';
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
        }
        /*,
                computed: {
                    getAllegiance() {
                        if (this.currentUser.maximalist) {
                            return 'Bitcoin Maximalist';
                        } else {
                            return 'Multicoinist';
                        }
                    }
                }*/
        ,
        components: {
            Login
        },
        methods: {
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
            }
        },
        apollo: {
            currentUser: gql `
                query currentUser {
                    currentUser {
                        _id
                        username
                        email
                        emailValidated
                        active
                        admin
                        allegiance
                        maximalist
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
                    if (!this.currentUser || this.currentUser.admin === false) return true
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
                    if (!this.currentUser || this.currentUser.admin === false) return true
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
                    }`
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .allegiance {
        font-size: 2rem;
        margin: 3rem;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 75%;
        height: 5rem;
        padding: .5rem;
        margin: .5rem;
        border: 0.1rem solid $color-white;
    }

    p {
        font-size: 3rem;
    }

    li {
        margin-bottom: 3rem;
    }

    textarea {
        width: 100%;
        height: 5rem;
    }
</style>