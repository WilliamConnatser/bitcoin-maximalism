<template>
    <div id="login">
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
    #login {
        max-width: 100rem;
        margin: 0 auto;
    }
</style>