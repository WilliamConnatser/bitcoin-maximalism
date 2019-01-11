<template>
    <div>
        <h1>Sign Up</h1>
        <form @submit.prevent="signupUser">
            <div class="block">
                <label>Username</label>
                <input type="text" v-model="username" autocomplete="username">
            </div>
            <div class="block">
                <label>Email</label>
                <input type="email" v-model="email" autocomplete="email">
            </div>
            <div class="block">
                <label>Password</label>
                <input type="password" v-model="password" autocomplete="password">
            </div>
            <button type="submit">Register</button> <br />

            <div @click="$emit('toggle-login')">
                Already Registered?
                <h2>Sign In Here!</h2>
            </div>
        </form>
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
                password: ""
            }
        },
        methods: {
            signupUser() {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation($username: String!, $email: String!, $password: String!) {
                            signupUser(username: $username, email:$email, password:$password){
                                token
                            }
                        }
                    `,
                    variables: {
                        username: this.username,
                        email: this.email,
                        password: this.password
                    }
                }).then(async ({data}) => {
                    //Insert token into Local Storage
                    await localStorage.setItem("token", data.signupUser.token);
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
                        admin
                        allegiance
                        maximalist
                    }
                }
            `
        }
    };
</script>