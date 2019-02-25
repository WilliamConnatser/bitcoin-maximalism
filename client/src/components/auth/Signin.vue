<template>
    <div>
        <h1>Sign In</h1>
        <form @submit.prevent="signinUser">
            <div class="medium-margin">
                <label>Email</label>
                <input type="email" v-model="email" autocomplete="email" class="wide-input">
            </div>
            <div class="medium-margin">
                <label>Password</label>
                <input type="password" v-model="password" autocomplete="password" class="wide-input"> <br />
                <router-link to="/reset-password">Forgot Password?</router-link>
            </div>

            <button type="submit">Login</button>

            <h2 v-if="$apollo.loading" class="loading">Loading...</h2>
            <div class="medium-margin">
                <a @click="$emit('toggle-login')" class="fancy-link cursor-pointer">
                    Not Registered Yet?
                    <h2>Sign Up Here!</h2>
                </a>
            </div>
        </form>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "Signin",
        data: () => {
            return {
                email: "",
                password: "",
                currentUser: null
            }
        },
        methods: {
            signinUser() {
                if (this.validateForm()) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                        mutation($email:String!, $password: String!) {
                            signinUser(email: $email,password: $password) {
                                token
                            }
                        }
                    `,
                        variables: {
                            email: this.email,
                            password: this.password
                        }
                    }).then(async ({
                        data
                    }) => {
                        //Insert token into Local Storage
                        await localStorage.setItem("token", data.signinUser.token);
                        this.$apollo.queries.currentUser.refetch();
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validateForm() {
                if (this.email.trim() === "") this.$toasted.show('Enter an email', {
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
                else if (this.password.trim() === "") this.$toasted.show('Enter a password', {
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
                else return true;
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
    };
</script>

<style lang="scss" scoped>
    @import "../../sass/variables.scss";
</style>