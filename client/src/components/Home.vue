<template>
    <div>
        <h1>Home</h1>
        <TodoList />
    </div>
</template>

<script>
    import TodoList from './TodoList';

    export default {
        name: 'Home',
        components: {
            TodoList
        }
    }
</script>