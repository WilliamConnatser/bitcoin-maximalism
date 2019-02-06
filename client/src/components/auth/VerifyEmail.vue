<template>
    <div class="normal-text">
        <h1>Verify Email</h1>

        <div v-if="!success && $apollo.loading">
            Please wait for your token to be validated.
        </div>
        <div v-else-if="!resent">
            Your email verification token is either invalid or expired. Please request a new verification email
            below:
        </div>

        <form v-if="!resent" @submit.prevent="resendEmail">
            <div class="medium-margin">
                <label for="email">Account Email</label>
                <input v-model="email" type="email" class="wide-input">
            </div>
            <button type="submit" class="wide-button">Resend Verification Email</button>
        </form>
        <span v-else>A verification email has been resent.</span>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "VerifyEmail",
        data: () => {
            return {
                currentUser: null,
                success: false,
                email: "",
                resent: false
            }
        },
        methods: {
            verifyEmail() {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation verifyEmail($token: String!){
                            verifyEmail(token: $token) {
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
                    await localStorage.setItem("token", data.verifyEmail.token);
                    //Refresh the currentUser query
                    this.$apollo.queries.currentUser.refetch();
                    //Send user to the Account Panel
                    this.$router.push({
                        path: '/account'
                    });
                }).catch(error => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            },
            resendEmail() {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation resendRegistrationEmail($email: String!){
                            resendRegistrationEmail(email: $email)
                        }
                    `,
                    variables: {
                        email: this.email
                    }
                }).then(async ({
                    data
                }) => {
                    this.resent = data.resendRegistrationEmail;
                }).catch(error => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            }
        },
        created() {
            this.verifyEmail();
        },
        watch: {
            currentUser(newValue) {
                if(newValue.emailVerified) {
                    this.$router.push({
                        path: '/account'
                    });
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
                        }
                    }
                `
            }
        }
    };
</script>