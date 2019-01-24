<template>
    <div class="section">
        <Login v-if="!getCurrentUser" />
        <div v-if="getCurrentUser">
            <h1>Account Panel</h1>
            <button id="signOut" v-if="getCurrentUser" @click="signoutUser">Signout</button>

            <div class="allegiance">
                <p v-if="!getCurrentUser.allegiance">
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

            <div v-show="getCurrentUser.admin">
                <h2>You so fancy! Look are you, Mr. Administrator...</h2>
                <ul>
                    <li v-for="unapprovedOpinion in getUnapprovedOpinions" :key="unapprovedOpinion._id">
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
                getCurrentUser: null,
                getUnapprovedOpinions: null,
                approved: null,
                approvalCommentary: []
            }
        },
        computed: {
            getAllegiance() {
                if (this.getCurrentUser.maximalist) {
                    return 'Bitcoin Maximalist';
                } else {
                    return 'Multicoinist';
                }
            }
        },
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
                if (this.getCurrentUser.maximalist && allegiance === 'Maximalist') {
                    return 'background-color: #41b883';
                } else if (!this.getCurrentUser.maximalist && allegiance === 'Multicoinist') {
                    return 'background-color: #41b883';
                }
            },
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
                    //Refresh the getCurrentUser query
                    this.$apollo.queries.getCurrentUser.refetch();
                }).catch(error => {
                    // Error :\
                    console.error(error);
                });
            },
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
                    //Refresh the getCurrentUser query
                    this.$apollo.queries.getUnapprovedOpinions.refetch();
                }).catch(error => {
                    // Error :\
                    console.error(error);
                });
            }
        },
        apollo: {
            getCurrentUser: gql `
                query getCurrentUser {
                    getCurrentUser {
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
            getUnapprovedOpinions: {
                query: gql `
                    query {
                        getUnapprovedOpinions {
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
                    if(!this.getCurrentUser || this.getCurrentUser.admin === false) return true
                }
            },
            getUnapprovedEdits: {
                query: gql `query {
                    getUnapprovedEdits {
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
                    if(!this.getCurrentUser || this.getCurrentUser.admin === false) return true
                }
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