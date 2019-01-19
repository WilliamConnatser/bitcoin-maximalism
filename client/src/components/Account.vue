<template>
    <div class="section">
        <Login v-if="!getCurrentUser" />
        <div v-if="getCurrentUser">
            <h1>Welcome {{getCurrentUser.username}}!</h1>
            <button id="signOut" v-if="getCurrentUser" @click="signoutUser">Signout</button>
            <p v-if="!getCurrentUser.allegiance">
                You have not yet sworn allegiance to either faction. Your ancestors would be ashamed...
            </p>
            <p v-else>
                You think you're a {{getAllegiance}}, huh? <br />
                <strong>
                    <a v-if="!getCurrentUser.passedQuiz" href="#quiz">Prove it!</a>
                </strong>
            </p>

            <button @click="setAllegiance('Maximalist')" :style="getStyle('Maximalist')">
                I identify as a Bitcoin Maximalist
            </button>
            <button @click="setAllegiance('Multicoinist')" :style="getStyle('Multicoinist')">
                I identify as a Multicoinist
            </button>

            <p v-show="getCurrentUser.admin">
                You so fancy! Look are you, Mr. Administrator...
            </p>
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
                getCurrentUser: null
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
                            setAllegiance(allegiance: $allegiance){
                                _id
                                username
                                email
                                admin
                                allegiance
                                maximalist
                            }
                        }
                    `,
                    variables: {
                        allegiance
                    }
                }).then(() => {
                    //Refresh the getCurrentUser query
                    this.$apollo.queries.getCurrentUser.refetch();
                }).catch(error => {
                    // Error :\
                    console.error(error);
                })
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
            `
        }
    };
</script>