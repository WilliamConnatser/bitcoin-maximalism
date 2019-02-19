<template>
    <div >
        <h1>Reset Pasword</h1>

        <div v-if="!validated && $apollo.loading">
            Please wait for your token to be validated.
        </div>
        <div v-else-if="!validated && !resent">
            Your password token is either invalid or expired. Please request a new email below:
        </div>
        <div v-else-if="validated && !reset">
            <form @submit.prevent="resetPassword">
                <div class="medium-margin">
                    <label for="newPassword1">Password</label>
                    <input type="password" v-model="newPassword1">
                </div>
                <div class="medium-margin">
                    <label for="newPassword1">Re-Enter Password</label>
                <input type="password" v-model="newPassword2">
                </div>
                <button>Change Password</button>
            </form>
        </div>
        <div v-else-if="!resent">
            Your password was successfully reset. Sending you to sign in.
        </div>

        <form v-if="!resent && !validated && !$apollo.loading" @submit.prevent="resendEmail">
            <div class="medium-margin">
                <label for="email">Account Email</label>
                <input v-model="email" type="email" class="wide-input">
            </div>
            <button type="submit" class="wide-button">Resend Password Reset Email</button>
        </form>
        <span v-else-if="resent">An email to reset you password has been resent.</span>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "VerifyPassword",
        data: () => {
            return {
                currentUser: null,
                validated: false,
                email: "",
                newPassword1: "",
                newPassword2: "",
                resent: false,
                reset: false
            }
        },
        methods: {
            resetPassword() {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation resetPassword($token: String!, $newPassword1: String!, $newPassword2: String!){
                            resetPassword(token: $token, newPassword1: $newPassword1, newPassword2: $newPassword2) {
                                token
                            }
                        }
                    `,
                    variables: {
                        token: this.$route.params.token,
                        newPassword1: this.newPassword1,
                        newPassword2: this.newPassword2
                    }
                }).then(async ({
                    data
                }) => {
                    //Sign in user with the token that was returned
                    //Insert token into Local Storage
                    await localStorage.setItem("token", data.resetPassword.token);
                    this.reset = true;
                    //Refresh the currentUser query
                    await this.$apollo.queries.currentUser.refetch();
                    //Send user to the Account Panel
                    this.$router.push({
                        path: '/account'
                    });
                }).catch(() => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            },
            verifyPasswordReset() {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation verifyPasswordReset($token: String!){
                            verifyPasswordReset(token: $token) {
                                token
                            }
                        }
                    `,
                    variables: {
                        token: this.$route.params.token
                    }
                }).then(async ({
                    data
                }) => {
                    //Sign in user with the token that was returned
                    //Insert token into Local Storage
                    await localStorage.setItem("token", data.verifyPasswordReset.token);
                    this.validated = true;
                    //Refresh the currentUser query
                    await this.$apollo.queries.currentUser.refetch();
                }).catch(() => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            },
            resendEmail() {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation resendPasswordEmail($email: String!){
                            resendPasswordEmail(email: $email)
                        }
                    `,
                    variables: {
                        email: this.email
                    }
                }).then(() => {
                    this.resent = true
                }).catch(() => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            }
        },
        created() {
            this.verifyPasswordReset();
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
                        }
                    }
                `
            }
        }
    };
</script>