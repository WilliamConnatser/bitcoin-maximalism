<template>
    <div>
        <h1>Sign Up</h1>
        <form @submit.prevent="register">
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
            register() {
                this.$store.dispatch('signupUser', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                });
            }
        }
    };
</script>