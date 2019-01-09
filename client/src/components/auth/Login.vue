<template>
    <div>
        <Signin v-show="aUser" v-on:toggle-login="toggleLogin"/>
        <Signup v-show="!aUser" v-on:toggle-login="toggleLogin"/>
    </div>
</template>

<script>
    import Signin from './Signin';
    import Signup from './Signup';

    export default {
        name: "Login",
        data: () => {
            return {
                aUser: true
            }
        },
        components: {
            Signin,
            Signup
        },
        methods: {
            toggleLogin(){
                this.aUser = !this.aUser;
            }
        }
    };
</script>

<style>
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