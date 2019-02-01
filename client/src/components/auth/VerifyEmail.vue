<template>
    <div>
        <h1>Verifying Email...</h1>

        <div v-if="!success">
            If you have a slow connection, then please wait for your token to be validated. <br />
            If you're seeing this, then your email validation token is either invalid or expired. <br />
            Please request a new validation email below:
        </div>

        <form v-if="!resent" @submit.prevent="resendEmail">
            <label for="email">What email did you sign up with?</label>
            <input v-model="email" type="email">
            <button type="submit">Resend Validation Email</button>
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
                        mutation resendEmail($email: String!){
                            resendEmail(email: $email)
                        }
                    `,
                    variables: {
                        email: this.email
                    }
                }).then(async ({
                    data
                }) => {
                    this.resent = data.resendEmail;
                }).catch(error => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            }
        },
        created() {
            this.verifyEmail();
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
            `
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../sass/variables.scss";

    form>* {
        margin: 1rem;
    }

    input {
        text-align: center;
        display: inline-block;
        width: 75vw;
        height: 4rem;
        font-size: 1.5rem;
        border: 0.1rem solid $color-white;
    }

    label {
        text-align: center;
        color: $color-white;
        display: inline-block;
        width: 80vw;
        font-size: 1.9rem;
        font-weight: 300;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 40vw;
        height: 4rem;
        padding: .5rem;
        margin-bottom: 4rem;
        border: 0.1rem solid $color-dark-grey;
    }
</style>