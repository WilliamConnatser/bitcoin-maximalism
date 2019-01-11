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
            <button type="submit">Login</button> <br />

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
                }).then(async ({ data }) => {
                    //Insert token into Local Storage
                    await localStorage.setItem("token", data.signinUser.token);
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

<style scoped>
    input {
        display: inline-block;
        *display: inline;
        margin: 0.1em;
        width: 15em;
        font-size: 1em;
        padding: 0.25em;
        height: 1.5em;
        border: 0.1em solid #ffffff;
    }

    label {
        display: inline-block;
        width: 4em;
        margin-right: 1em;
        text-align: right;
        font-size: 1.2em;
        font-weight: 200;
        color: whitesmoke;
    }

    button {
        color: #ffffff;
        font-size: 1.5em;
        width: 5em;
        padding: .5em;
        margin-bottom: 1em;
        background-color: #ffffff00;
        border: 0.1em solid #4e4e4e;
    }

    .block {
        margin: 1em;
    }

    @media only screen and (max-width: 400px) {

        label {
            text-align: center;
        }
    }
</style>