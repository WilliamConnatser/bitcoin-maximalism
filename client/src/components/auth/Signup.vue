<template>
    <div >
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
            <div class="medium-margin">
                <label @click="toggleCheck()" for="agree" class="checkbox">
                    <input type="checkbox" name="agree" class=".checkbox">
                    <font-awesome-icon v-if="!checked" icon="square" title="Unchecked" class="checkbox__icon" />
                    <font-awesome-icon v-else icon="check-square" title="Checked" class="checkbox__icon" />
                </label>
                I have read and agree to the <router-link to="/terms">Terms</router-link> &amp;
                <router-link to="/privacy">Privacy Policy</router-link>
            </div>
            <button type="submit">Register</button>
            <div class="medium-margin">
                <a @click="$emit('toggle-login')" class="fancy-link cursor-pointer">
                    Already Registered?
                    <h2>Sign In Here!</h2>
                </a>
            </div>
        </form>
        <span v-else>Please check your email for verification. If you didn't receive it, then you may request a new one
            <router-link to="/verify-email/eyJhbGci">here</router-link>.</span>
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
                success: false,
                checked: false
            }
        },
        methods: {
            toggleCheck() {
                this.checked = !this.checked;
            },
            signupUser() {

                var query = {};
                var variables = {};
                if (!this.checked) {
                    this.$toasted.global.accept_tos();
                    return false;
                } else if (this.username.trim() === "") {
                    this.$toasted.global.username();
                } else if (this.email.trim() === "") {
                    this.$toasted.global.email();
                } else if (this.password.trim() === "") {
                    this.$toasted.global.password();
                } else if (localStorage.ref) {
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
                }).catch(() => {
                    // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                });
            }
        }
    };
</script>