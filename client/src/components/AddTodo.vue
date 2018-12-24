<template>
    <div>
        <form @submit.prevent="onSubmit">
            <input ref="task" type="text">
            <button type="submit" id="submit">Add Todo</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'AddTodo',
        methods: {
            onSubmit() {
                //Call Vuex action for adding Todos, pass the form's value
                this.$store.dispatch('addTodo', this.$refs.task.value);
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