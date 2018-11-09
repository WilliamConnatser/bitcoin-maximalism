<template>
    <div>
        <div v-if="loading">
            Loading...
        </div>

        <div v-else>

            <AddTodo />

            <table>
                <thead>
                    <tr>
                        <td>
                            Task
                        </td>
                        <td>
                            Status
                        </td>
                        <td>
                            Date Created
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <TodoListItem v-for="task in todos" :task="task" :key="task._id" />
                    <tr v-if="noTasks">
                        <td>
                            You haven't added any tasks to your todo list yet. <br />
                            Add a new todo task <a href="/add-todo">here</a>.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import AddTodo from './AddTodo';
    import TodoListItem from './TodoListItem';

    import {
        mapGetters
    } from 'vuex';

    export default {
        name: 'TodoList',
        created() {
            //Queries database on page load by calling handleGetTodos method
            this.handleGetTodos();
        },
        components: {
            TodoListItem,
            AddTodo
        },
        methods: {
            handleGetTodos() {
                //Calls Store Action which executes a GraphQL query
                this.$store.dispatch('getTodos');
            }
        },
        computed: {
            ...mapGetters(['loading', 'todos']),
            noTasks() {
                //Check if any Todos have been loaded into the Store
                if (this.$store.getters.todos.length === 0) {
                    return true;
                }
            }
        }
    }
</script>

<style>

    table {
        margin-left: auto;
        margin-right: auto;
        border-collapse: collapse;
        font-family: sans-serif;
    }

    table,
    th,
    td {
        border: 0.1rem solid #c31932;
        padding: 1rem;
    }

    tbody tr:hover {
        background-color: #464646;
        color: #ffffff;
    }

    thead {
        background-color: #c31932;
        color: #ffffff;
        text-shadow: 1rem;
    }

    #addTodo {
        background-color: #464646;
        color: #ffffff;
        margin: 1em;
    }
</style>