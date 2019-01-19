<template>
    <div>
        <h1>Sign In</h1>
        <form @submit.prevent="signinUser">
            <div class="block">
                <label>Email</label>
                <input type="email" v-model="email" autocomplete="email">
            </div>
            <div class="block">
                <label>Password</label>
                <input type="password" v-model="password" autocomplete="password">
            </div>
            <button type="submit">Login</button>

            <div @click="$emit('toggle-login')">
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
                    //Refresh the getCurrentUser query
                    this.$apollo.queries.getCurrentUser.refetch();
                }).catch(error => {
                    // Error :\
                    // Error handled in main.js
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
                        emailValidated
                        active
                        admin
                        allegiance
                        maximalist
                    }
                }
            `
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../sass/variables.scss";

    input {
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
        font-weight: 200;
    }

    button {
        color: $color-white;
        font-size: 1.5rem;
        width: 40vw;
        height: 4rem;
        padding: .5rem;
        margin-bottom: 4rem;
        border: 0.1rem solid $color-dark-grey;
    }

    .block {
        margin: 3rem;
    }
</style>