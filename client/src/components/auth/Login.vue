<template>
    <div>
        <Signin v-show="aUser" v-on:toggle-login="toggleLogin" />
        <Signup v-show="!aUser" v-on:toggle-login="toggleLogin" />
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
            toggleLogin() {
                this.aUser = !this.aUser;
            }
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