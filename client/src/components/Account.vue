<template>
    <div class="section">
        <div class="wrapper">
            <Login v-if="!user" />
            <div v-if="user">
                <h1>Welcome {{user.username}}!</h1>
                <p v-if="!user.allegiance">
                    You have not yet sworn allegiance to either faction. Your ancestors would be ashamed...

                    <button @click="setAllegiance('Maximalist')">
                        I identify as a Bitcoin Maximalist
                    </button>
                    <button @click="setAllegiance('Multicoinist')">
                        I identify as a Multicoinist
                    </button>
                </p>
                <p v-else>
                    You think you're a {{getAllegiance}}?
                    <a v-if="!user.passedQuiz">Prove it!</a>
                </p>

                <div v-show="!user.admin">
                    Hey, hey, hey! Fancy! {{user.username}} is an administrator.
                    <button>Populate Database</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Login from './auth/Login';
    import {
        mapState,
        mapActions
    } from 'vuex';

    export default {
        name: "Account",
        computed: {
            ...mapState({
                user: state => state.auth.user
            }),
            getAllegiance() {
                if (this.user.maximalist) {
                    return "Bitcoin Maximalist";
                } else {
                    return "Multicoinist";
                }
            }
        },
        methods: {
            ...mapActions(['setAllegiance'])
        },
        components: {
            Login
        }
    };
</script>

<style scoped>
    button {
        white-space: nowrap;
        color: #ffffff;
        font-size: 1em;
        width: 17em;
        height: 5em;
        margin: 1em;
        border: 0.1em solid #4e4e4e;
    }

    .selected {}

    @media only screen and (max-width: 400px) {

        button {
            width: 17em;
            margin: 0em;
            margin-top: 1em;
        }
    }
</style>