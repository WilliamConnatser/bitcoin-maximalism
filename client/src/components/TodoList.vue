<template>
    <div>
        <h1>Todo List</h1>
        <div v-if="loading">
            Loading...
        </div>
        <TodoListItem v-else v-for="task in todos" :key="task._id"/>
    </div>
</template>

<script>
    import TodoListItem from './TodoListItem';
    import {mapGetters} from 'vuex';

    export default {
        name: 'TodoList',
        created() {
            //Queries database on page load by calling handleGetTodos method
            this.handleGetTodos();
        },
        components: {
            TodoListItem
        },
        methods: {
            handleGetTodos() {
                //Calls Store Action which executes a GraphQL query
                this.$store.dispatch('getTodos');
            }
        },
        computed: {
            ...mapGetters(['loading', 'todos'])
        }
    }
</script>