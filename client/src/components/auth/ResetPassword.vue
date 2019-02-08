<template>
    <div class="normal-text">
        <h1>Reset Password</h1>

        <form v-if="!reset" @submit.prevent="startPasswordReset">
            <div class="medium-margin">
                <label for="email">Account Email</label>
                <input v-model="email" type="email" class="wide-input">
            </div>
            <button type="submit" class="wide-button">Reset Password</button>
        </form>
        <span v-else>An email has been sent. Follow the link to reset your password.</span>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ResetPassword",
        data: () => {
            return {
                currentUser: null,
                email: "",
                reset: false
            }
        },
        methods: {
            startPasswordReset() {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation startPasswordReset($email: String!){
                            startPasswordReset(email: $email)
                        }
                    `,
                    variables: {
                        email: this.email
                    }
                }).then(() => {
                    this.reset = true
                }).catch(() => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            }
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