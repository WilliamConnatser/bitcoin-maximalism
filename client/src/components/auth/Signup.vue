<template>
    <div class="normal-text">
        <h1>Sign Up</h1>
        <form v-if="!success" @submit.prevent="signupUser">
            <div class="block">
                <label>Username</label>
                <input type="text" v-model="username" autocomplete="username" class="wide-input">
            </div>
            <div class="block">
                <label>Email</label>
                <input type="email" v-model="email" autocomplete="email" class="wide-input">
            </div>
            <div class="block">
                <label>Password</label>
                <input type="password" v-model="password" autocomplete="password" class="wide-input">
            </div>
            <button type="submit">Register</button>

            <div @click="$emit('toggle-login')" class="block">
                Already Registered?
                <h2>Sign In Here!</h2>
            </div>
        </form>
        <span v-else>Please check your email for verification.</span>
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
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation($username: String!, $email: String!, $password: String!) {
                            signupUser(username: $username, email:$email, password:$password)
                        }
                    `,
                    variables: {
                        username: this.username,
                        email: this.email,
                        password: this.password
                    }
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