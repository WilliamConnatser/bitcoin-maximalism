<template>
    <div>
        <form @submit.prevent="onSubmit">
            <button @click="goHome" id="cancel">Cancel</button>
            <input>
            <button type="submit" id="submit">Add Todo</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'AddTodo',
        methods: {
            goHome() {
                console.log("cancel")
                this.$router.push('/')
            },
            onSubmit() {
                console.log("add")
            }
        }
    }
</script>

<style>
    form {
        margin-left: auto;
        margin-right: auto;
        border-collapse: collapse;
        font-family: sans-serif;
        margin: 1em;
    }

    input {
        height: 2.5em;
    }

    button {
        border: 0;
        height: 3em;
    }

    #cancel {
        background-color: #464646;
        color: #ffffff;
    }

    #submit {
        background-color: #c31932;
        color: #ffffff;
    }
</style>