import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import AddTodo from './components/AddTodo.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
//  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/add-todo',
      name: 'AddTodo',
      component: AddTodo
    }

  ]
})
