<template>
    <div class="normal-text">
        <h1>Sign Up</h1>
        <form v-if="!success" @submit.prevent="signupUser">
            <div class="medium-margin">
                <label>Username</label>
                <input type="text" v-model="username" autocomplete="username" class="wide-input">
            </div>
            <div class="medium-margin">
                <label>Email</label>
                <input type="email" v-model="email" autocomplete="email" class="wide-input">
            </div>
            <div class="medium-margin">
                <label>Password</label>
                <input type="password" v-model="password" autocomplete="password" class="wide-input">
            </div>
            <button type="submit">Register</button>

            <div @click="$emit('toggle-login')" class="medium-margin">
                Already Registered?
                <h2>Sign In Here!</h2>
            </div>
        </form>
        <span v-else>Please check your email for verification. If you didn't receive it, then you may request a new one <router-link to="/verify-email/eyJhbGci">here</router-link>.</span>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "Signup",
        data: () => {
            return {
                username: "",
                email: "",
                password: "",
                success: false
            }
        },
        methods: {
            signupUser() {
                var query = {};
                var variables = {}
                if (localStorage.ref) {
                    query = gql `
                        mutation($username: String!, $email: String!, $password: String!, $ref: ID!) {
                            signupUser(username: $username, email:$email, password:$password, ref: $ref)
                        }
                    `
                    variables = {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        ref: localStorage.ref
                    }

                } else {
                    query = gql `
                        mutation($username: String!, $email: String!, $password: String!) {
                            signupUser(username: $username, email:$email, password:$password)
                        }
                    `

                    variables = {
                        username: this.username,
                        email: this.email,
                        password: this.password
                    }
                }

                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: query,
                    variables: variables
                }).then(async ({
                    data
                }) => {
                    if (data.signupUser) this.success = true;
                }).catch(error => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
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
            `
        }
    };
</script>