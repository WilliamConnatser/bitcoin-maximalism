import Vue from 'vue'
import Router from 'vue-router'
import TodoList from './components/TodoList.vue'
import AddTodo from './components/AddTodo.vue'
import PageNotFound from './components/PageNotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  //  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'TodoList',
      component: TodoList
    },
    {
      path: '/add-todo',
      name: 'AddTodo',
      component: AddTodo
    },
    {
      path: "*",
      name: 'PageNotFound',
      component: PageNotFound
    }

  ]
})