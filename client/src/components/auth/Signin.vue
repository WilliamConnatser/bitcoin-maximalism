<template>
    <div class="normal-text">
        <h1>Sign In</h1>
        <form @submit.prevent="signinUser">
            <div class="block">
                <label>Email</label>
                <input type="email" v-model="email" autocomplete="email" class="wide-input">
            </div>
            <div class="block">
                <label>Password</label>
                <input type="password" v-model="password" autocomplete="password" class="wide-input"> <br/>
                <router-link to="/reset-password">Forgot Password?</router-link>
            </div>
                        
            <button type="submit">Login</button>

            <div @click="$emit('toggle-login')" class="block">
                Not Registered Yet?
                <h2>Sign Up Here!</h2>
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
                password: ""
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
                    }).catch(error => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validateForm() {
                if (this.email.trim() === "") this.$toasted.global.email();
                else if (this.password.trim() === "") this.$toasted.global.password();
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
                    }
                }
            `
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../sass/variables.scss";
</style>